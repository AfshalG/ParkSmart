/**
 * Fetches the HDB Carpark Information dataset from data.gov.sg and
 * generates lib/fpsCarparks.js — the set of carpark IDs that participate
 * in the Free Parking Scheme (free_parking === "YES").
 *
 * Run: node scripts/generate-fps-list.js
 * Update quarterly or whenever HDB announces FPS changes.
 */

const OUT_PATH = new URL("../lib/fpsCarparks.js", import.meta.url).pathname;
const API_URL =
  "https://data.gov.sg/api/action/datastore_search" +
  "?resource_id=d_23f946fa557947f93a8043bbef41dd09&limit=5000";

async function main() {
  console.log("Fetching HDB Carpark Information from data.gov.sg…");
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  const records = json?.result?.records;
  if (!Array.isArray(records)) throw new Error("Unexpected response shape");

  // free_parking field values: "NO" or "SUN & PH FR 7AM-10.30PM"
  const fpsList = records
    .filter((r) => r.free_parking !== "NO" && r.free_parking)
    .map((r) => r.car_park_no);

  fpsList.sort();
  console.log(`Found ${fpsList.length} FPS carparks out of ${records.length} total.`);

  const today = new Date().toISOString().slice(0, 7); // YYYY-MM
  const ids = fpsList.map((id) => `  '${id}'`).join(",\n");
  const content = `// Generated from data.gov.sg HDB Carpark Information (free_parking = "YES")
// Last updated: ${today}
// Run: node scripts/generate-fps-list.js  to refresh
export const FPS_CARPARKS = new Set([
${ids},
]);
`;

  const fs = await import("fs/promises");
  await fs.writeFile(OUT_PATH, content, "utf8");
  console.log(`Written to lib/fpsCarparks.js`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
