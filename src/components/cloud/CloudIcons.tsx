import type { CSSProperties } from 'react';

type IconProps = {
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
  'aria-hidden'?: boolean;
};

// Lucide-style stroke icons. The artwork lives in public/icons/<name>.svg —
// one file per icon — and is pulled in with <use>, not inlined here.
//
// Each file wraps its shapes in <g id="i"> with no paint of its own, so the
// fill, stroke, width and caps set on this <svg> reach them: the icon takes
// currentColor, and a per-call strokeWidth still works. The attributes on the
// file's root <svg> only matter when the file is opened on its own.
function icon(name: string) {
  const href = `/icons/${name}.svg#i`;
  return function Icon({ className, style, strokeWidth = 2, ...rest }: IconProps) {
    return (
      <svg
        className={className}
        style={style}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={rest['aria-hidden'] ?? true}
      >
        <use href={href} />
      </svg>
    );
  };
}

export const ArrowRight = icon('arrow-right');
export const TrendingUp = icon('trending-up');
export const RefreshCw = icon('refresh-cw');
export const DatabaseBackup = icon('database-backup');
export const FlaskConical = icon('flask-conical');
export const LineChart = icon('line-chart');
export const Headset = icon('headset');
export const LogOut = icon('log-out');
export const Info = icon('info');
export const Target = icon('target');
export const Repeat = icon('repeat');
export const LockKeyhole = icon('lock-keyhole');
export const Mail = icon('mail');
export const AtSign = icon('at-sign');
export const Globe = icon('globe');
export const Check = icon('check');
export const AlertCircle = icon('alert-circle');
export const Menu = icon('menu');
export const Github = icon('github');
export const ArrowLeft = icon('arrow-left');
export const ArrowUpLeft = icon('arrow-up-left');
export const Smartphone = icon('smartphone');
export const FileX = icon('file-x');
export const Lock = icon('lock');
export const CloudOff = icon('cloud-off');
export const Pill = icon('pill');
export const HeartPulse = icon('heart-pulse');
export const Network = icon('network');
export const Apple = icon('apple');
export const Play = icon('play');
export const User = icon('user');
export const Stethoscope = icon('stethoscope');
export const Home = icon('home');
export const Calendar = icon('calendar');
export const FileText = icon('file-text');
export const Settings = icon('settings');
export const GitBranch = icon('git-branch');
export const ShieldCheck = icon('shield-check');
export const Users = icon('users');
export const Languages = icon('languages');
export const WifiOff = icon('wifi-off');
export const Gem = icon('gem');
export const UserRound = icon('user-round');
export const Building2 = icon('building-2');
export const CodeXml = icon('code-xml');
export const HeartHandshake = icon('heart-handshake');
export const Server = icon('server');
export const BadgeDollarSign = icon('badge-dollar-sign');
export const ScanBarcode = icon('scan-barcode');
export const Package = icon('package');
export const ClipboardList = icon('clipboard-list');
export const ShieldAlert = icon('shield-alert');
export const UsersRound = icon('users-round');
export const BarChart3 = icon('bar-chart-3');
export const Terminal = icon('terminal');
export const Copy = icon('copy');
export const MapPin = icon('map-pin');
export const Tag = icon('tag');
export const Sparkles = icon('sparkles');
export const GitPullRequest = icon('git-pull-request');
export const Megaphone = icon('megaphone');
export const Bell = icon('bell');
export const PlusCircle = icon('plus-circle');
export const Plus = icon('plus');
export const Flame = icon('flame');
export const Activity = icon('activity');
export const Droplet = icon('droplet');
export const Bug = icon('bug');
export const Unplug = icon('unplug');
export const LifeBuoy = icon('life-buoy');
export const Puzzle = icon('puzzle');
export const ChevronRight = icon('chevron-right');
export const Clock = icon('clock');
export const FolderHeart = icon('folder-heart');
export const ArrowUpRight = icon('arrow-up-right');
export const ArrowDownRight = icon('arrow-down-right');
// Huawei AppGallery — the design lists it as a third store badge.
export const AppGallery = icon('app-gallery');
export const BrainCircuit = icon('brain-circuit');
export const PenTool = icon('pen-tool');
export const Scale = icon('scale');
export const Kanban = icon('kanban');
export const BadgeCheck = icon('badge-check');
export const Frame = icon('frame');
export const ImagePlus = icon('image-plus');
export const Download = icon('download');
// Filled glyphs used on /links. Their files set fill on the <g>, which wins
// over the stroke defaults above.
export const MailFilled = icon('mail-filled');
export const SunFilled = icon('sun-filled');
export const MoonFilled = icon('moon-filled');
