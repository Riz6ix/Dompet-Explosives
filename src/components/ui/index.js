/**
 * components/ui/index.js
 * Barrel export — import semua UI components dari sini
 *
 * Usage:
 *   import { LucideIcon, AnimatedNumber, Toast } from '../components/ui';
 *   import { WalletLogo, Download, KasIcon } from '../components/ui';
 */

export { default as LucideIcon } from "./LucideIcon.jsx";
export { default as IconDisplay } from "./IconDisplay.jsx";
export { default as AnimatedNumber } from "./AnimatedNumber.jsx";
export { default as AnimatedNumberWithTrend } from "./AnimatedNumberWithTrend.jsx";
export { default as ErrorBoundary } from "./ErrorBoundary.jsx";
export { default as Toast } from "./Toast.jsx";
export { default as CustomSelect } from "./CustomSelect.jsx";

// Icons — named exports
export {
  Download,
  Plus,
  Eye,
  Calendar,
  Wallet,
  Users,
  CheckCircle,
  XCircle,
  HalfCircle,
  Filter,
  TrendingUp,
  ClipboardList,
  TrendingDown,
  DollarSign,
  WalletLogo,
  SchoolLogo,
  CicilanIcon,
  KasIcon,
  IuranIcon,
  HistoryIcon,
  InfoIcon,
} from "./Icons.jsx";
