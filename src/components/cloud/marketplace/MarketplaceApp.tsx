'use client';

import SiteShell from '../SiteShell';
import type { NavAccount } from '../navAccount';
import { activeCompany, type State, type View } from './state';
import { useMarketplace, type MkActions } from './useMarketplace';
import { useMt } from './ui';
import Browse from './Browse';
import Detail from './Detail';
import Auth from './Auth';
import NewWorkspace from './NewWorkspace';
import Workspace from './Workspace';
import WsType, { NotVendor } from './WsType';
import EmailVerify from './EmailVerify';
import OrgForm from './OrgForm';
import Legal from './Legal';
import Waitlist from './Waitlist';
import ListingForm from './ListingForm';
import Mine from './Mine';
import Team from './Team';
import Account from './Account';

type ViewProps = { s: State; a: MkActions };

const VIEWS: Record<View, (p: ViewProps) => React.ReactNode> = {
  directory: Browse,
  detail: Detail,
  auth: Auth,
  newws: NewWorkspace,
  workspace: Workspace,
  wstype: WsType,
  notvendor: NotVendor,
  emailv: EmailVerify,
  verify: OrgForm,
  legal: Legal,
  waitlist: Waitlist,
  form: ListingForm,
  mine: Mine,
  team: Team,
  account: Account,
};

// The design's nav props (user-name, companies, orgs, on-switch-org, …) mapped
// onto the shared NavAccount shape, with labels already translated.
function useNavAccount(s: State, a: MkActions): NavAccount {
  const { t, name } = useMt();
  if (!s.signedIn) return { onSignIn: a.goSignIn };
  const ws = activeCompany(s);
  const pub = ws?.entities.find((e) => e.id === s.pubId);
  return {
    userName: s.uname.trim(),
    userEmail: s.email.trim(),
    hasCompany: s.companies.length > 0,
    canList: pub?.type === 'software',
    companies: s.companies.map((co) => ({ name: name(co), handle: '@' + co.handle, roleLabel: t(`roles.${co.role}`), count: co.entities.length, active: co.id === s.activeCo })),
    orgs: (ws?.entities || []).map((e) => ({ name: name(e), typeLabel: t(`types.${e.type}.label`), statusLabel: t(`status.${e.status}`), active: e.id === s.pubId })),
    onMine: a.goMine,
    onSignOut: a.signOut,
    onTeam: a.goTeam,
    onWorkspace: a.goWorkspace,
    onAccount: a.goAccount,
    onAddCompany: a.addCompany,
    onNewListing: a.goList,
    onSwitchCompany: a.switchCompany,
    onSwitchOrg: a.switchOrg,
  };
}

export default function MarketplaceApp() {
  const { s, a } = useMarketplace();
  const account = useNavAccount(s, a);
  const Current = VIEWS[s.view];
  return (
    <SiteShell active="market" account={account}>
      <div style={{ overflowX: 'hidden' }}>
        <Current key={s.view} s={s} a={a} />
      </div>
    </SiteShell>
  );
}
