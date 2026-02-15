"use client";
import styles from "./RecommendationBanner.module.css";

const BANNER_COPY = {
  SUNDAY_FREE: (rec) =>
    `🎉 ${rec.freeCount} carpark${rec.freeCount > 1 ? "s are" : " is"} FREE today (Sun/PH Free Parking Scheme, 7am–10:30pm).`,

  EVENING_SOON: (rec) =>
    `⏱ Wait ${rec.waitMinutes} min — night rates start at 10:30 PM. Save $${rec.savingsAmount.toFixed(2)} at ${rec.bestCarpark?.name || "the cheapest carpark"}.`,

  NIGHT_ACTIVE: () =>
    `🌙 Night rates active — most HDB carparks capped at $5 until 7 AM.`,

  EARLY_BIRD: (rec) =>
    `🌅 Early bird rates may apply at ${rec.ltaCount} mall carpark${rec.ltaCount > 1 ? "s" : ""} — check the entrance board.`,
};

/**
 * Renders a single time-aware recommendation banner above the results list.
 * Highest-priority type wins (SUNDAY_FREE > EVENING_SOON > NIGHT_ACTIVE > EARLY_BIRD).
 *
 * @param {{ recommendations: Array }} props
 */
export default function RecommendationBanner({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  const rec = recommendations[0];
  const copy = BANNER_COPY[rec.type]?.(rec);
  if (!copy) return null;

  const typeClass = {
    SUNDAY_FREE: styles.typeSundayFree,
    EVENING_SOON: styles.typeEveningSoon,
    NIGHT_ACTIVE: styles.typeNightActive,
    EARLY_BIRD: styles.typeEarlyBird,
  }[rec.type] || "";

  return (
    <div className={`${styles.banner} ${typeClass}`}>
      {copy}
    </div>
  );
}
