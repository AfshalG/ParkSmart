import { Capacitor } from "@capacitor/core";

// Fixed ID for the single parking reminder notification — easy to cancel/replace.
const PARKING_NOTIF_ID = 1001;

/**
 * Returns the LocalNotifications plugin, or null when running in a browser
 * (Capacitor is not native). All callers must null-check the return value.
 */
async function getPlugin() {
  if (!Capacitor.isNativePlatform()) return null;
  const { LocalNotifications } = await import("@capacitor/local-notifications");
  return LocalNotifications;
}

/**
 * Request notification permission. Returns true if granted.
 * Always returns false in the browser (graceful no-op).
 */
export async function requestNotificationPermission() {
  const LN = await getPlugin();
  if (!LN) return false;
  try {
    const { display } = await LN.checkPermissions();
    if (display === "granted") return true;
    const result = await LN.requestPermissions();
    return result.display === "granted";
  } catch {
    return false;
  }
}

/**
 * Schedule a parking reminder notification.
 * Cancels any existing parking notification before scheduling the new one.
 * Does nothing in the browser or when reminderMins is 0.
 *
 * @param {object} opts
 * @param {number} opts.expiresAt  - Unix timestamp (ms) when parking expires
 * @param {number} opts.reminderMins - How many minutes before expiry to fire
 */
export async function scheduleParkingReminder({ expiresAt, reminderMins }) {
  if (!reminderMins) return;
  const LN = await getPlugin();
  if (!LN) return;

  const fireAt = new Date(expiresAt - reminderMins * 60 * 1000);
  if (fireAt <= new Date()) return; // reminder time already passed — skip

  try {
    // Always cancel the old one first so we never have duplicates
    await LN.cancel({ notifications: [{ id: PARKING_NOTIF_ID }] });
    await LN.schedule({
      notifications: [
        {
          id: PARKING_NOTIF_ID,
          title: "🅿️ Parking Reminder",
          body: `Your parking expires in ${reminderMins} min${reminderMins === 1 ? "" : "s"}.`,
          schedule: {
            at: fireAt,
            // allowWhileIdle ensures the notification fires even in Android Doze mode
            allowWhileIdle: true,
          },
          extra: null,
        },
      ],
    });
  } catch (err) {
    // Non-fatal — the app still works without notifications
    console.warn("Failed to schedule parking reminder:", err);
  }
}

/**
 * Cancel the pending parking reminder, e.g. when the user taps "Done Parking".
 * No-op in the browser.
 */
export async function cancelParkingReminder() {
  const LN = await getPlugin();
  if (!LN) return;
  try {
    await LN.cancel({ notifications: [{ id: PARKING_NOTIF_ID }] });
  } catch {
    // ignore
  }
}
