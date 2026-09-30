import BalsmNav, { type NavKey } from './BalsmNav';
import BalsmFooter from './BalsmFooter';

// Wraps every design page: light-locked theme, sticky nav (with active tab),
// main content, and the shared footer. `active` is omitted on pages that
// aren't in the nav (e.g. the privacy policy), so no tab lights up.
export default function SiteShell({ active, children }: { active?: NavKey; children: React.ReactNode }) {
  return (
    <div className="cloud-light" style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      <BalsmNav active={active} />
      <main className="flex-1" role="main">
        {children}
      </main>
      <BalsmFooter />
    </div>
  );
}
