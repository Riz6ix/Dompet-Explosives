/**
 * constants/index.js
 * Barrel export — import semua constants dari sini
 *
 * Usage:
 *   import { DEFAULT_KAS_AMOUNT, DEFAULT_MEMBERS_DATA, TIPS } from '../constants';
 */

export {
  DEFAULT_KAS_AMOUNT,
  DEFAULT_START_DATE,
  TRANSACTION_TYPES,
  EXPENSE_CATEGORIES,
  STORAGE_KEYS,
  ITEMS_PER_PAGE,
} from "./config.js";

export { DEFAULT_MEMBERS_DATA } from "./members.js";

// TIPS removed — tips are now inline in App.jsx