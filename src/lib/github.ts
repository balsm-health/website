/**
 * Newcomer-friendly open issues from the Balsm GitHub org, for the
 * Contributors page: `good-first-issue` issues, or — when there are none —
 * bugs marked easy or medium priority.
 *
 * Fetched on the server at render time and cached for an hour, so the page
 * stays static-ish and a GitHub outage or rate limit never blocks a render —
 * `fetchOrgIssues` returns an empty list on any failure and the UI falls back
 * to a "browse the org" state.
 *
 * Scope is deliberately `is:public`: the search API returns private-repo
 * issues to an authenticated token, and this list is shown to anonymous
 * visitors. Leaking private roadmap titles onto the marketing site would be a
 * real disclosure bug, so the filter is not optional.
 */

export const GITHUB_ORG = 'balsm-health';
export const GITHUB_ORG_URL = `https://github.com/${GITHUB_ORG}`;

/**
 * The label that puts an issue on the Contributors page. The repos also carry
 * GitHub's default `good first issue` (spaces); this one, with hyphens, is the
 * label the team curates for the site.
 */
export const GOOD_FIRST_ISSUE_LABEL = 'good-first-issue';

/**
 * Fallback when no good-first-issue is open: `bug` plus an easy or
 * medium-priority label. No repo defines these yet, so the common spellings
 * are all accepted — whichever the team creates will match. Easy first.
 */
const EASY_LABELS = ['easy', 'difficulty: easy', 'difficulty:easy', 'difficulty/easy'];
const MEDIUM_PRIORITY_LABELS = ['priority: medium', 'priority:medium', 'priority/medium', 'medium priority', 'P2'];

const BASE_QUERY = `org:${GITHUB_ORG} is:issue is:open is:public`;
const anyOf = (labels: string[]) => `label:${labels.map((l) => `"${l}"`).join(',')}`;

export type IssueFilter = 'goodFirst' | 'starterBugs';

const QUERIES: Record<IssueFilter, string> = {
  goodFirst: `${BASE_QUERY} label:"${GOOD_FIRST_ISSUE_LABEL}"`,
  starterBugs: `${BASE_QUERY} label:bug ${anyOf([...EASY_LABELS, ...MEDIUM_PRIORITY_LABELS])}`,
};

/** Issue-search URL a visitor can open to see the same list on GitHub. */
export const githubIssuesUrl = (filter: IssueFilter) =>
  `https://github.com/issues?q=${encodeURIComponent(QUERIES[filter])}`;

export type GithubLabel = { name: string; color: string };

export type GithubIssue = {
  id: number;
  number: number;
  title: string;
  url: string;
  repo: string;
  labels: GithubLabel[];
  comments: number;
  createdAt: string;
};

type SearchItem = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  repository_url: string;
  labels?: { name: string; color: string }[];
  comments?: number;
  created_at: string;
};

function normalize(item: SearchItem): GithubIssue {
  return {
    id: item.id,
    number: item.number,
    title: item.title,
    url: item.html_url,
    repo: item.repository_url.split('/').pop() ?? '',
    labels: (item.labels ?? []).map((l) => ({ name: l.name, color: l.color })),
    comments: item.comments ?? 0,
    createdAt: item.created_at,
  };
}

const isEasy = (i: GithubIssue) =>
  i.labels.some((l) => EASY_LABELS.includes(l.name.toLowerCase()));

/** Labels on every row of a list, so the UI can skip chips that say nothing. */
export const FILTER_LABELS: Record<IssueFilter, string[]> = {
  goodFirst: [GOOD_FIRST_ISSUE_LABEL],
  starterBugs: ['bug'],
};

async function searchIssues(q: string, limit: number): Promise<GithubIssue[]> {
  const url =
    `https://api.github.com/search/issues?q=${encodeURIComponent(q)}` +
    `&sort=created&order=desc&per_page=${limit}`;

  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'balsm-website',
  };
  // Optional. Anonymous search is 10 req/min per IP — survivable behind the
  // one-hour cache, but Workers egress IPs are shared, so a token makes this
  // reliable. Set it as a Cloudflare secret when you want the headroom.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: SearchItem[] };
    return (data.items ?? []).map(normalize);
  } catch {
    return [];
  }
}

export async function fetchOrgIssues(
  limit = 6,
): Promise<{ filter: IssueFilter; issues: GithubIssue[] }> {
  const goodFirst = await searchIssues(QUERIES.goodFirst, limit);
  if (goodFirst.length > 0) return { filter: 'goodFirst', issues: goodFirst };

  // Over-fetch so easy bugs aren't crowded out by newer medium-priority ones.
  const bugs = await searchIssues(QUERIES.starterBugs, Math.min(limit * 3, 50));
  const ranked = [...bugs.filter(isEasy), ...bugs.filter((i) => !isEasy(i))];
  return { filter: 'starterBugs', issues: ranked.slice(0, limit) };
}
