import BalsmNav, { type NavKey } from './BalsmNav';
import BalsmFooter from './BalsmFooter';
import type { NavAccount } from './navAccount';

// Wraps every design page: light-locked theme, sticky nav (with active tab),
// main content, and the shared footer. `active` is omitted on pages that
// aren't in the nav (e.g. the legal pages), so no tab lights up. `account` is
// only passed by pages with a signed-in state (the marketplace).
export default function SiteShell({ active, account, children }: { active?: NavKey; account?: NavAccount; children: React.ReactNode }) {
  return (
    <div className="cloud-light" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <BalsmNav active={active} account={account} />
      <main className="flex-1" role="main">
        {children}
      </main>
      <BalsmFooter />
    </div>
  );
}
