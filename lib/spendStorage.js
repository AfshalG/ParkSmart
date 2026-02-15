const KEY = "parksmart_spend_log";

/**
 * Log a completed parking session.
 */
export function logSpend({ carparkName, carparkId, agency, cost, durationHours, parkedAt, endedAt, lat, lng }) {
  const log = getSpendLog();
  const entry = {
    id: `spend_${parkedAt}`,
    carparkName: carparkName || "Unknown Carpark",
    carparkId: carparkId || null,
    agency: agency || "HDB",
    cost: Math.round(cost * 100) / 100,
    durationHours: Math.round(durationHours * 10) / 10,
    parkedAt,
    endedAt,
    lat,
    lng,
  };
  log.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(log));
  window.dispatchEvent(new CustomEvent("spendLogChange", { detail: log }));
  return entry;
}

/**
 * Get all log entries, newest first.
 */
export function getSpendLog() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Delete all history.
 */
export function clearSpendLog() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("spendLogChange", { detail: [] }));
}

/**
 * Delete a single entry by id.
 */
export function deleteEntry(id) {
  const log = getSpendLog().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(log));
  window.dispatchEvent(new CustomEvent("spendLogChange", { detail: log }));
}

/**
 * Returns total spend for given SGT year + 0-indexed month.
 */
export function getMonthlyTotal(year, month) {
  return getSpendLog()
    .filter((e) => {
      const d = new Date(e.parkedAt + 8 * 3600 * 1000);
      return d.getUTCFullYear() === year && d.getUTCMonth() === month;
    })
    .reduce((sum, e) => sum + e.cost, 0);
}

/**
 * Returns entries for given SGT year + 0-indexed month.
 */
export function getMonthEntries(year, month) {
  return getSpendLog().filter((e) => {
    const d = new Date(e.parkedAt + 8 * 3600 * 1000);
    return d.getUTCFullYear() === year && d.getUTCMonth() === month;
  });
}

/**
 * Returns last `weeks` weekly totals: [{ weekLabel, total }]
 * Ordered oldest → newest (left to right in bar chart).
 */
export function getWeeklyTotals(weeks = 8) {
  const log = getSpendLog();
  const now = Date.now();
  const result = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = now - (i + 1) * 7 * 24 * 3600 * 1000;
    const weekEnd   = now -  i      * 7 * 24 * 3600 * 1000;
    const total = log
      .filter((e) => e.parkedAt >= weekStart && e.parkedAt < weekEnd)
      .reduce((sum, e) => sum + e.cost, 0);
    const d = new Date(weekStart);
    const label = d.toLocaleDateString("en-SG", {
      month: "short",
      day: "numeric",
      timeZone: "Asia/Singapore",
    });
    result.push({ weekLabel: label, total });
  }
  return result;
}

/**
 * Returns top N carparks by total spend.
 */
export function getTopCarparks(limit = 5) {
  const byName = {};
  for (const e of getSpendLog()) {
    if (!byName[e.carparkName]) {
      byName[e.carparkName] = { carparkName: e.carparkName, agency: e.agency, totalCost: 0, visits: 0 };
    }
    byName[e.carparkName].totalCost = Math.round((byName[e.carparkName].totalCost + e.cost) * 100) / 100;
    byName[e.carparkName].visits++;
  }
  return Object.values(byName)
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, limit);
}
