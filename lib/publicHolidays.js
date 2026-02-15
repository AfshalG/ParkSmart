/**
 * Singapore public holidays for 2025 and 2026.
 * Source: Ministry of Manpower (mom.gov.sg)
 * Update annually by adding the following year's dates.
 */

const HOLIDAYS = new Set([
  // 2025
  "2025-01-01", // New Year's Day
  "2025-01-29", // Chinese New Year
  "2025-01-30", // Chinese New Year (Day 2)
  "2025-03-31", // Hari Raya Puasa
  "2025-04-18", // Good Friday
  "2025-05-01", // Labour Day
  "2025-05-12", // Vesak Day
  "2025-06-07", // Hari Raya Haji
  "2025-08-09", // National Day
  "2025-10-20", // Deepavali
  "2025-12-25", // Christmas Day

  // 2026
  "2026-01-01", // New Year's Day
  "2026-01-17", // Chinese New Year
  "2026-01-18", // Chinese New Year (Day 2)
  "2026-03-20", // Hari Raya Puasa
  "2026-04-03", // Good Friday
  "2026-05-01", // Labour Day
  "2026-05-31", // Vesak Day
  "2026-05-27", // Hari Raya Haji
  "2026-08-10", // National Day (observed, falls on Sunday)
  "2026-11-07", // Deepavali
  "2026-12-25", // Christmas Day
]);

/**
 * Returns true if the given timestamp falls on a Sunday or Singapore public holiday.
 * Uses Singapore timezone (Asia/Singapore, UTC+8) for date comparison.
 *
 * @param {number} tsMs - Unix timestamp in milliseconds
 * @returns {boolean}
 */
export function isSundayOrPH(tsMs) {
  // Convert to Singapore time (UTC+8)
  const sgDate = new Date(tsMs + 8 * 3600 * 1000);

  // getUTCDay() on the shifted date gives the SG local day-of-week
  if (sgDate.getUTCDay() === 0) return true; // Sunday

  // YYYY-MM-DD in SG local time
  const key = sgDate.toISOString().slice(0, 10);
  return HOLIDAYS.has(key);
}
