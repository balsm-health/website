// What a page can hand the nav so it shows a signed-in account menu instead of
// the "sign in" button. Only the marketplace does this today; every other page
// leaves it out and gets the signed-out header. Labels arrive already
// translated: the nav renders them as given.
export type NavCompany = {
  name: string;
  handle?: string;
  roleLabel: string;
  count?: number;
  active?: boolean;
};

export type NavOrg = {
  name: string;
  typeLabel: string;
  statusLabel: string;
  active?: boolean;
};

export type NavAccount = {
  userName?: string;
  userEmail?: string;
  hasCompany?: boolean;
  canList?: boolean;
  companies?: NavCompany[];
  orgs?: NavOrg[];
  onSignIn?: () => void;
  onMine?: () => void;
  onSignOut?: () => void;
  onTeam?: () => void;
  onWorkspace?: () => void;
  onAccount?: () => void;
  onAddCompany?: () => void;
  onNewListing?: () => void;
  onSwitchCompany?: (index: number) => void;
  onSwitchOrg?: (index: number) => void;
};
