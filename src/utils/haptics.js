/**
 * haptics.js
 * Haptic feedback utility — navigator.vibrate wrapper
 * Aman untuk semua browser (no-op jika tidak support)
 */

/**
 * Trigger haptic feedback jika device support
 * @param {"light"|"medium"|"heavy"|"success"|"error"} type
 */
export function haptic(type = "light") {
  if (!navigator.vibrate) return;

  const patterns = {
    light: 10,
    medium: 20,
    heavy: 40,
    success: [10, 30, 10],
    error: [20, 10, 20, 10, 20],
  };

  try {
    navigator.vibrate(patterns[type] || 10);
  } catch {
    // silently fail
  }
}
