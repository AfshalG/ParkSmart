# Frontend Redesign: Instrument Cluster — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace ParkSmart's generic indigo/purple SaaS palette with an "Instrument Cluster" automotive aesthetic — warm charcoal backgrounds, amber gold accents, IBM Plex Mono for numerical data, Rajdhani for headings/labels, SVG nav icons.

**Architecture:** Pure CSS module changes + one font URL update + SVG icon components. Zero changes to business logic, layouts, spacing, or component structure. Each task is independently committable and visually verifiable.

**Tech Stack:** Next.js 14 CSS Modules, Google Fonts (via `<link>` tag in layout.js), vanilla SVG icons as React components.

**Design doc:** `docs/plans/2026-02-15-frontend-design.md` — refer to it for full color token map, typography spec, and component treatments.

**Verify after each task:** Run `npm run dev` and open `http://localhost:3000`. The app must render without errors.

---

## Task 1: Update Google Fonts + add CSS font variables

**Files:**
- Modify: `app/layout.js` (line 38 — Google Fonts link)
- Modify: `app/globals.css` (body font-family + add font variables)

**What this does:** Swaps DM Sans + Space Mono → Rajdhani + IBM Plex Mono + Outfit.

**Step 1: Update the Google Fonts URL in `app/layout.js`**

Replace line 38 (the existing `<link href="https://fonts.googleapis.com/css2?family=DM+Sans...` tag) with:

```jsx
<link
  href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600&family=Outfit:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

**Step 2: Update `themeColor` in `app/layout.js`**

Change line 22:
```js
// Before
themeColor: "#6366F1",
// After
themeColor: "#0E1014",
```

**Step 3: Add font variables + update body font in `app/globals.css`**

At the top of `:root { ... }`, add these three lines before the existing variables:
```css
--font-display: 'Rajdhani', sans-serif;
--font-mono:    'IBM Plex Mono', monospace;
--font-body:    'Outfit', sans-serif;
```

In the `body { ... }` rule, replace the `font-family` line:
```css
/* Before */
font-family: 'DM Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
/* After */
font-family: var(--font-body);
```

**Step 4: Start dev server and verify**

```bash
cd ~/ParkSmart && npm run dev
```

Open `http://localhost:3000`. The body text should now use Outfit. The app name "ParkSmart" will still use the old font for now (fixed in Task 5).

**Step 5: Commit**

```bash
cd ~/ParkSmart && git add app/layout.js app/globals.css && git commit -m "feat: add Rajdhani + IBM Plex Mono + Outfit fonts"
```

---

## Task 2: Replace color tokens in `globals.css`

**Files:**
- Modify: `app/globals.css` (`:root` block — lines 15–33)

**What this does:** Replaces the entire color system. This is the highest-impact single change — every accent color in the app shifts from purple to amber.

**Step 1: Replace the entire `:root` block**

Find and replace the current `:root { ... }` block (lines 15–33) with:

```css
:root {
  /* Backgrounds — warm near-black */
  --bg-primary:    #0E1014;
  --bg-secondary:  #13161C;
  --bg-card:       rgba(255,255,255,0.025);
  --bg-elevated:   #1A1E26;

  /* Borders */
  --border:        rgba(255,255,255,0.055);
  --border-active: rgba(212,168,90,0.45);

  /* Text — warm whites */
  --text-primary:  #F0EDE8;
  --text-secondary:#A89F94;
  --text-muted:    #6B6460;
  --text-dim:      #4A4340;

  /* Amber — primary accent (replaces indigo) */
  --amber:         #D4A85A;
  --amber-light:   #F0C47A;
  --amber-dim:     rgba(212,168,90,0.12);

  /* Keep these as aliases so existing CSS that references --accent still works */
  --accent:        #D4A85A;
  --accent-light:  #F0C47A;

  /* Functional colors */
  --teal:          #00CCA8;  /* replaces --green for availability/positive */
  --teal-dark:     #00A88A;  /* replaces --green-dark */
  --green:         #00CCA8;  /* alias so existing .cardCost { color: var(--green) } still works */
  --green-dark:    #00A88A;
  --red:           #E05555;
  --orange:        #F07840;  /* replaces --yellow */
  --yellow:        #F07840;  /* alias so existing code using --yellow still works */
  --pink:          #F06080;  /* kept — not used much */
}
```

**Step 2: Update the scrollbar thumb color in `globals.css`**

Find:
```css
::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 3px; }
```
Replace with:
```css
::-webkit-scrollbar-thumb { background: rgba(212, 168, 90, 0.2); border-radius: 3px; }
```

**Step 3: Update the leaflet container background to match new bg-primary**

Find:
```css
.leaflet-container {
  background: #0D1321 !important;
}
```
Replace with:
```css
.leaflet-container {
  background: #0E1014 !important;
}
```

**Step 4: Update leaflet attribution link color**

Find:
```css
.leaflet-control-attribution a {
  color: var(--accent-light) !important;
}
```
This will now correctly use the amber alias. No change needed — the alias handles it.

**Step 5: Update the skeleton shimmer gradient to warm amber tint**

Find the `.skeleton` rule and replace the `background` gradient:
```css
/* Before */
background: linear-gradient(
  90deg,
  rgba(255,255,255,0.04) 25%,
  rgba(255,255,255,0.08) 50%,
  rgba(255,255,255,0.04) 75%
);
/* After */
background: linear-gradient(
  90deg,
  rgba(212,168,90,0.04) 25%,
  rgba(212,168,90,0.09) 50%,
  rgba(212,168,90,0.04) 75%
);
```

**Step 6: Verify**

```bash
npm run dev
```

Open app. The submit button should now show amber gradient instead of purple. Card focus states glow amber. All interactive highlights shift to warm gold.

**Step 7: Commit**

```bash
cd ~/ParkSmart && git add app/globals.css && git commit -m "feat: replace purple color tokens with amber instrument cluster palette"
```

---

## Task 3: Create SVG icon components

**Files:**
- Create: `components/icons/SearchIcon.js`
- Create: `components/icons/ParkingIcon.js`
- Create: `components/icons/BookmarkIcon.js`
- Create: `components/icons/ChartIcon.js`

**What this does:** Replaces the emoji icons in the bottom nav with consistent thin-line SVG icons.

**Step 1: Create `components/icons/SearchIcon.js`**

```jsx
export default function SearchIcon({ size = 22, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}
```

**Step 2: Create `components/icons/ParkingIcon.js`**

```jsx
export default function ParkingIcon({ size = 22, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 17V7h4.5a3 3 0 0 1 0 6H9" />
    </svg>
  );
}
```

**Step 3: Create `components/icons/BookmarkIcon.js`**

```jsx
export default function BookmarkIcon({ size = 22, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
```

**Step 4: Create `components/icons/ChartIcon.js`**

```jsx
export default function ChartIcon({ size = 22, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}
```

**Step 5: Commit**

```bash
cd ~/ParkSmart && git add components/icons/ && git commit -m "feat: add SVG icon components for bottom nav"
```

---

## Task 4: Update BottomNav.js + BottomNav.module.css

**Files:**
- Modify: `components/BottomNav.js` (lines 1–12 — imports + TABS array)
- Modify: `components/BottomNav.module.css` (full rewrite of active/icon styles)

**What this does:** Replaces emoji icons with SVG components, changes active tab to amber, adds top-rail indicator.

**Step 1: Update `components/BottomNav.js` — add icon imports**

At the top of the file, add after the existing imports (after line 5):
```js
import SearchIcon from "./icons/SearchIcon";
import ParkingIcon from "./icons/ParkingIcon";
import BookmarkIcon from "./icons/BookmarkIcon";
import ChartIcon from "./icons/ChartIcon";
```

**Step 2: Update the TABS array in `BottomNav.js`**

Replace lines 7–12 (the TABS array):
```js
const TABS = [
  { href: "/",           Icon: SearchIcon,   label: "Find"    },
  { href: "/parked",     Icon: ParkingIcon,  label: "Parked"  },
  { href: "/stats",      Icon: ChartIcon,    label: "Tracker" },
  { href: "/favourites", Icon: BookmarkIcon, label: "Saved"   },
];
```

**Step 3: Update the JSX in BottomNav.js to render SVG icons**

In the `return` block, find:
```jsx
<span className={styles.tabIcon}>{tab.icon}</span>
```
Replace with:
```jsx
<tab.Icon size={22} className={styles.tabIcon} aria-hidden="true" />
```

**Step 4: Update `components/BottomNav.module.css`**

Replace the `.tabIcon` rule:
```css
/* Before */
.tabIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 20px;
  line-height: 1;
}
/* After */
.tabIcon {
  display: block;
  width: 22px;
  height: 22px;
  transition: transform 0.15s ease;
}
```

Replace the `.tabActive` rule:
```css
/* Before */
.tabActive {
  color: var(--accent-light);
}
/* After */
.tabActive {
  color: var(--amber);
}
```

Replace the `.tab:hover` rule:
```css
/* Before */
.tab:hover {
  color: var(--text-secondary);
}
/* After */
.tab:hover {
  color: var(--amber-light);
}
```

Replace the `.tabLabel` rule:
```css
/* Before */
.tabLabel {
  font-size: 10px;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
/* After */
.tabLabel {
  font-size: 9px;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

Replace the `.tabActive .tabLabel::after` rule (the dot below label) with a top-rail indicator on the tab itself:
```css
/* Remove the dot */
.tabActive .tabLabel::after {
  display: none;
}

/* Add a scale effect on the icon when active */
.tabActive .tabIcon {
  transform: scale(1.08);
}
```

Add a press animation:
```css
.tab:active .tabIcon {
  transform: scale(0.92);
}
```

Replace the nav background to use the new bg color:
```css
/* Before */
background: rgba(10, 14, 26, 0.92);
/* After */
background: rgba(14, 16, 20, 0.94);
```

**Step 5: Update the `.savedCount` badge background**

Find:
```css
.savedCount {
  ...
  background: var(--yellow);
  ...
}
```
The `--yellow` alias now maps to `--orange` (amber-warm) from the new palette. This will update automatically. No change needed.

**Step 6: Verify**

```bash
npm run dev
```

Bottom nav should now show thin SVG icons. Active tab highlights in amber. Emoji glyphs gone.

**Step 7: Commit**

```bash
cd ~/ParkSmart && git add components/BottomNav.js components/BottomNav.module.css && git commit -m "feat: replace emoji nav icons with SVG, amber active state"
```

---

## Task 5: Update Header.js + Header.module.css

**Files:**
- Modify: `components/Header.js` (logo box content)
- Modify: `components/Header.module.css` (logo, title, subtitle)

**What this does:** Replaces the generic purple gradient logo box with a dark charcoal box with an amber "P", updates font to Rajdhani.

**Step 1: Update `components/Header.js`**

Replace the `<div className={styles.logoBox}>🅿️</div>` on line 8 with:
```jsx
<div className={styles.logoBox}>
  <span className={styles.logoLetter}>P</span>
</div>
```

**Step 2: Update `components/Header.module.css`**

Replace the `.logoBox` rule:
```css
/* Before */
.logoBox {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
}
/* After */
.logoBox {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: var(--bg-elevated);
  border: 1.5px solid var(--amber);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(212, 168, 90, 0.15);
}
```

Add the `.logoLetter` rule:
```css
.logoLetter {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: var(--amber);
  line-height: 1;
  letter-spacing: -0.02em;
}
```

Replace the `.appName` rule:
```css
/* Before */
.appName {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #e2e8f0, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
/* After */
.appName {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.01em;
  font-family: var(--font-display);
  color: var(--amber-light);
  line-height: 1;
}
```

Replace the `.subtitle` rule:
```css
/* Before */
.subtitle {
  font-size: 10px;
  color: var(--text-muted);
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.06em;
}
/* After */
.subtitle {
  font-size: 10px;
  color: var(--text-muted);
  font-family: var(--font-body);
  letter-spacing: 0.03em;
  font-weight: 400;
}
```

Update the `.glow` radial gradient to amber:
```css
/* Before */
background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
/* After */
background: radial-gradient(circle, rgba(212, 168, 90, 0.06) 0%, transparent 70%);
```

**Step 3: Verify**

```bash
npm run dev
```

Header logo: dark box with amber "P" border. "ParkSmart" text in Rajdhani amber-light. No more purple gradient.

**Step 4: Commit**

```bash
cd ~/ParkSmart && git add components/Header.js components/Header.module.css && git commit -m "feat: redesign header with amber logobox and Rajdhani font"
```

---

## Task 6: Update ResultsList.module.css — cards + badges

**Files:**
- Modify: `components/ResultsList.module.css`

**What this does:** Adds left accent bars to cards, redesigns badge colors/fonts, updates button styles, replaces Space Mono with font variables.

**Step 1: Update the `.card` rule — left accent bar setup**

Replace the `.card` rule:
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  /* Left accent bar */
  border-left: 3px solid rgba(255,255,255,0.08);
  /* Stagger animation support */
  animation: cardEntry 0.3s ease both;
  animation-delay: var(--stagger-delay, 0ms);
}
```

Replace `.cardSelected`:
```css
.cardSelected {
  background: color-mix(in srgb, var(--bg-secondary) 85%, var(--amber) 15%);
  border-color: rgba(212, 168, 90, 0.12);
  border-left-color: var(--amber);
  box-shadow: 0 0 0 1px rgba(212, 168, 90, 0.15), 0 4px 20px rgba(0,0,0,0.35);
}
```

**Step 2: Add left bar color variants for each badge type**

Add after `.cardSelected`:
```css
/* Left bar coloring by result type — applied via inline style or JS className */
.cardBestMatch  { border-left-color: var(--amber); }
.cardCheapest   { border-left-color: var(--teal); }
.cardNearest    { border-left-color: var(--orange); }
.cardFavourited { border-left-color: rgba(212, 168, 90, 0.5); }
```

**Step 3: Add `cardEntry` keyframe to globals.css**

Open `app/globals.css` and add after the existing `@keyframes shimmer { ... }`:
```css
@keyframes cardEntry {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

**Step 4: Update cost and minor stat fonts in ResultsList.module.css**

Find and replace `.cardCost`:
```css
.cardCost {
  font-size: 20px;
  font-weight: 600;
  color: var(--teal);
  font-family: var(--font-mono);
}
```

Find and replace `.cardCostLabel`:
```css
.cardCostLabel {
  font-size: 11px;
  color: var(--text-muted);
  margin-left: 4px;
  font-family: var(--font-body);
}
```

Find and replace `.cardMinorStats`:
```css
.cardMinorStats {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}
```

**Step 5: Update badge styles**

Replace all badge rules:
```css
.badge {
  color: var(--text-primary);
  font-size: 9px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 5px;
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  white-space: nowrap;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.badgeBestMatch {
  background: var(--amber-dim);
  color: var(--amber-light);
  border-color: rgba(212, 168, 90, 0.3);
}
.badgeCheapest {
  background: rgba(0, 204, 168, 0.12);
  color: var(--teal);
  border-color: rgba(0, 204, 168, 0.25);
}
.badgeNearest {
  background: rgba(240, 120, 64, 0.12);
  color: var(--orange);
  border-color: rgba(240, 120, 64, 0.25);
}
.badgeFree {
  background: rgba(0, 204, 168, 0.12);
  color: var(--teal);
  border-color: rgba(0, 204, 168, 0.25);
}
```

**Step 6: Update agency badge colors**

Replace `.agencyHDB`, `.agencyURA`, `.agencyLTA`:
```css
.agencyHDB { background: rgba(56, 182, 255, 0.12); color: #60CBFF; font-family: var(--font-display); }
.agencyURA { background: var(--amber-dim);          color: var(--amber-light); font-family: var(--font-display); }
.agencyLTA { background: rgba(0, 204, 168, 0.12);   color: var(--teal); font-family: var(--font-display); }
```

Replace `.agencyBadge`:
```css
.agencyBadge {
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.05em;
}
```

**Step 7: Update button styles**

Replace `.navigateBtn`:
```css
.navigateBtn {
  flex: 1;
  padding: 12px;
  border-radius: 9px;
  border: none;
  background: var(--teal);
  color: #0A0A0A;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: all 0.2s;
}
.navigateBtn:active { transform: scale(0.97); }
```

Replace `.parkHereBtn`:
```css
.parkHereBtn {
  flex: 1;
  padding: 12px;
  border-radius: 9px;
  border: 1px solid rgba(212, 168, 90, 0.35);
  background: var(--amber-dim);
  color: var(--amber-light);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: all 0.2s;
}
.parkHereBtn:active { transform: scale(0.97); }
```

**Step 8: Update stat box labels to use font variables**

Replace `.statBoxLabel`:
```css
.statBoxLabel {
  font-size: 9px;
  color: var(--text-muted);
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 3px;
}
```

Replace `.statBoxValue`:
```css
.statBoxValue {
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-mono);
}
```

Replace `.costBreakdownTitle`:
```css
.costBreakdownTitle {
  font-size: 10px;
  font-weight: 700;
  color: var(--teal);
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
```

Replace `.costTotal`, `.costTotalAmount`:
```css
.costTotal {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 4px;
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--font-mono);
}
.costTotalAmount { color: var(--teal); }
```

Replace `.summaryChipLabel`:
```css
.summaryChipLabel {
  font-size: 9px;
  color: var(--text-muted);
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

**Step 9: Verify**

```bash
npm run dev
```

Search for a location. Cards should have a subtle left colored bar (amber for best match, teal for cheapest). Badges are flat with border outlines. Cost figures in IBM Plex Mono teal. Buttons are flat amber/teal, not gradient.

**Step 10: Commit**

```bash
cd ~/ParkSmart && git add components/ResultsList.module.css app/globals.css && git commit -m "feat: redesign carpark cards with accent bars, flat badges, mono data fonts"
```

---

## Task 7: Update SearchPanel.module.css

**Files:**
- Modify: `components/SearchPanel.module.css`

**What this does:** Updates focus states to amber, replaces Space Mono with font variables.

**Step 1: Replace Space Mono references**

In `SearchPanel.module.css`, replace every occurrence of:
```css
font-family: 'Space Mono', monospace;
```
with:
```css
font-family: var(--font-display);
```

There are 3 occurrences: `.label`, `.rangeLabel`, and any other label rules.

**Step 2: Update submit button styles**

Replace `.submitBtnActive`:
```css
.submitBtnActive {
  background: var(--amber);
  color: #0A0A0A;
  box-shadow: 0 4px 20px rgba(212, 168, 90, 0.3);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: var(--font-display);
}
```

Replace `.submitBtnDisabled`:
```css
.submitBtnDisabled {
  background: rgba(212, 168, 90, 0.25);
  color: rgba(212, 168, 90, 0.5);
  cursor: not-allowed;
}
```

Add `:active` state for the submit button:
```css
.submitBtnActive:active { transform: scale(0.98); }
```

**Step 3: Update priority button active state**

Replace `.priorityBtnActive`:
```css
.priorityBtnActive {
  border-color: var(--border-active);
  background: var(--amber-dim);
  color: var(--amber-light);
}
```

**Step 4: Update the `.label` and `.labelAccent`**

Replace `.labelAccent`:
```css
.labelAccent {
  color: var(--amber);
}
```

**Step 5: Verify**

```bash
npm run dev
```

Search panel: submit button is amber (flat, not purple gradient). Priority buttons active state is amber. Labels use Rajdhani.

**Step 6: Commit**

```bash
cd ~/ParkSmart && git add components/SearchPanel.module.css && git commit -m "feat: update search panel amber focus states and font"
```

---

## Task 8: Update parked.module.css — timer + progress bar

**Files:**
- Modify: `app/parked/parked.module.css`

**What this does:** Timer display in amber (most visible part of the Parked tab), adds a time-remaining progress bar, updates all Space Mono → font variables.

**Step 1: Replace Space Mono references**

In `parked.module.css`, replace every occurrence of:
```css
font-family: 'Space Mono', monospace;
```
with:
```css
font-family: var(--font-display);
```

There are occurrences in: `.pickerTitle`, `.timerLabel`, `.extendLabel`.

**Step 2: Update the timer display**

Replace `.timerDisplay`:
```css
.timerDisplay {
  font-size: 56px;
  font-weight: 700;
  color: var(--amber-light);
  font-family: var(--font-mono);
  line-height: 1;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
}
```

**Step 3: Add a progress bar below the timer**

Add these new rules after `.timerExpired`:
```css
/* Time remaining progress bar */
.timerProgressTrack {
  height: 3px;
  background: rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.timerProgressFill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s linear, background 0.5s ease;
  background: var(--amber);
}

.timerProgressExpiring {
  background: var(--orange);
}

.timerProgressExpired {
  background: var(--red);
  width: 100% !important;
}
```

Note: The actual `width` will be set via inline style in `parked/page.js` — this task is CSS only. The `.timerProgressExpiring` / `.timerProgressExpired` classes can be conditionally added later.

**Step 4: Update the park button**

Replace `.parkBtn`:
```css
.parkBtn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: var(--amber);
  color: #0A0A0A;
  font-size: 16px;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(212, 168, 90, 0.25);
  transition: all 0.2s;
}

.parkBtn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.parkBtn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 2px 12px rgba(212, 168, 90, 0.2);
}
```

**Step 5: Update navigate button**

Replace `.navigateBtn` in parked.module.css:
```css
.navigateBtn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: var(--teal);
  color: #0A0A0A;
  font-size: 15px;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 204, 168, 0.2);
  transition: all 0.2s;
}
.navigateBtn:active { transform: scale(0.97); }
```

**Step 6: Update duration and reminder active states**

Replace `.durationBtnActive`:
```css
.durationBtnActive {
  border-color: var(--border-active);
  background: var(--amber-dim);
  color: var(--amber-light);
}
```

Replace `.reminderBtnActive`:
```css
.reminderBtnActive {
  border-color: rgba(0, 204, 168, 0.4);
  background: rgba(0, 204, 168, 0.1);
  color: var(--teal);
}
```

**Step 7: Verify**

```bash
npm run dev
```

Navigate to `/parked`. The "Park Here" button is amber. Timer font is IBM Plex Mono amber. Park/reminder selection grids use amber/teal active states.

**Step 8: Commit**

```bash
cd ~/ParkSmart && git add app/parked/parked.module.css && git commit -m "feat: update parked tab — amber timer, amber park button, progress bar CSS"
```

---

## Task 9: Update remaining CSS files

**Files:**
- Modify: `components/RecommendationBanner.module.css`
- Modify: `app/favourites/favourites.module.css`
- Modify: `app/stats/stats.module.css`
- Modify: `app/page.module.css`

**What this does:** Sweeps remaining Space Mono references and purple color values across the other pages.

### 9a — RecommendationBanner.module.css

Replace the `.typeNightActive` rule:
```css
.typeNightActive {
  background: var(--amber-dim);
  border-color: rgba(212, 168, 90, 0.3);
  color: var(--amber-light);
}
```

The other banner types (SUNDAY_FREE, EVENING_SOON, EARLY_BIRD) use `--green`/`--yellow` which are now aliased correctly. No other changes needed.

### 9b — favourites.module.css

Replace every `font-family: 'Space Mono', monospace` with `font-family: var(--font-display)`.

Occurrences in: `.agencyChip`, `.cardId`, `.count`.

Replace `.actionBtn` (the primary action button):
```css
.actionBtn {
  flex: 1;
  padding: 10px;
  border-radius: 9px;
  border: none;
  background: var(--amber);
  color: #0A0A0A;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}
.actionBtn:active { transform: scale(0.97); }
```

Replace `.count` (the header count badge):
```css
.count {
  font-size: 12px;
  font-weight: 700;
  color: var(--amber-light);
  background: var(--amber-dim);
  border: 1px solid rgba(212, 168, 90, 0.25);
  border-radius: 10px;
  padding: 2px 8px;
  font-family: var(--font-display);
}
```

### 9c — stats.module.css

Replace every `font-family: 'Space Mono', monospace` with `font-family: var(--font-display)` or `var(--font-mono)` as appropriate:
- `.totalAmount` → `font-family: var(--font-mono)` (it's a dollar value)
- `.barAmount` → `font-family: var(--font-mono)`
- `.barLabel` → `font-family: var(--font-display)`
- `.monthLabel` → `font-family: var(--font-display)`
- `.totalCardLabel` → `font-family: var(--font-display)`
- `.sectionTitle` → `font-family: var(--font-display)`
- `.topAgency` → `font-family: var(--font-display)`
- `.topCost` → `font-family: var(--font-mono)`
- `.sessionCost` → `font-family: var(--font-mono)`
- `.totalSessions` → `font-family: var(--font-display)`

Replace `.totalSessions` badge:
```css
.totalSessions {
  font-size: 12px;
  font-weight: 700;
  color: var(--amber-light);
  background: var(--amber-dim);
  border: 1px solid rgba(212, 168, 90, 0.25);
  border-radius: 10px;
  padding: 2px 8px;
  font-family: var(--font-display);
}
```

### 9d — page.module.css

Replace `.welcomeFeatureLabel`:
```css
.welcomeFeatureLabel {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}
```

**Step: Verify**

```bash
npm run dev
```

Check all four tabs: Favourites (amber action buttons, no purple), Stats (teal bars, Rajdhani labels), Find (welcome screen uses font-display). No Space Mono anywhere.

**Commit all four files:**

```bash
cd ~/ParkSmart && git add \
  components/RecommendationBanner.module.css \
  app/favourites/favourites.module.css \
  app/stats/stats.module.css \
  app/page.module.css \
  && git commit -m "feat: sweep remaining tabs — amber/teal tokens, font variables, remove Space Mono"
```

---

## Task 10: Wire up stagger animation on ResultsList cards

**Files:**
- Modify: `components/ResultsList.js` (add `--stagger-delay` inline style to each card)

**What this does:** Makes carpark results reveal sequentially (not all at once) for a polished loading feel.

**Step 1: Find the card render in ResultsList.js**

In `components/ResultsList.js`, find where the `CarparkCard` component or the `.card` div is rendered in the list map. It will look something like:
```jsx
{carparks.map((cp, i) => (
  <CarparkCard key={cp.carparkNumber} carpark={cp} ... />
))}
```

**Step 2: Pass stagger index as a CSS custom property**

Add `style` prop to each card wrapper:
```jsx
{carparks.map((cp, i) => (
  <CarparkCard
    key={cp.carparkNumber}
    carpark={cp}
    style={{ '--stagger-delay': `${i * 55}ms` }}
    ...
  />
))}
```

If `CarparkCard` is an inner component in the same file, find its root `<div className={styles.card}>` and add `style={props.style}` or thread the prop through.

**Step 3: Verify**

```bash
npm run dev
```

Search for a destination. Results should cascade in — first card appears immediately, each subsequent card ~55ms later. Subtle but satisfying.

**Step 4: Commit**

```bash
cd ~/ParkSmart && git add components/ResultsList.js && git commit -m "feat: stagger card entry animation on search results"
```

---

## Task 11: Final review + cleanup

**Files:**
- Modify: `app/globals.css` — remove dead aliases if desired

**Step 1: Check for any remaining purple hex values**

Search the codebase for leftover purple values:
```bash
grep -r "6366[fF]1\|8[bB]5[cC][fF]6\|818[cC][fF]8" ~/ParkSmart/app ~/ParkSmart/components --include="*.css" --include="*.js"
```

If any results appear, update them to use the appropriate amber/teal token.

**Step 2: Check for any remaining `DM Sans` or `Space Mono` direct font-family strings**

```bash
grep -r "DM Sans\|Space Mono" ~/ParkSmart/app ~/ParkSmart/components --include="*.css" --include="*.js"
```

Replace any remaining ones with `var(--font-display)`, `var(--font-mono)`, or `var(--font-body)` as appropriate.

**Step 3: Final full visual check**

```bash
npm run dev
```

Check each tab systematically:
1. **Find tab** — header amber "P", search panel amber submit, card list with left accent bars, badges non-gradient, costs in IBM Plex Mono teal
2. **Parked tab** — amber timer text, amber park button, duration/reminder selectors in amber/teal
3. **Saved tab** — amber action button, amber count badge
4. **Stats tab** — teal bar chart, Rajdhani section labels, IBM Plex Mono dollar amounts
5. **Bottom nav** — SVG icons, active tab amber, no emoji

**Step 4: Final commit**

```bash
cd ~/ParkSmart && git add -A && git commit -m "feat: complete instrument cluster frontend redesign

- Amber/charcoal automotive palette replaces generic indigo purple
- Rajdhani (display) + IBM Plex Mono (data) + Outfit (body) font stack
- SVG thin-line icons in bottom navigation
- Left accent bars on carpark cards (amber/teal/orange by result type)
- Flat amber primary buttons, flat teal navigate buttons
- Stagger card entry animation
- Full removal of Space Mono and DM Sans references"
```

---

## Summary of Commits

| # | Commit message | Files |
|---|---|---|
| 1 | feat: add Rajdhani + IBM Plex Mono + Outfit fonts | layout.js, globals.css |
| 2 | feat: replace purple tokens with amber instrument cluster palette | globals.css |
| 3 | feat: add SVG icon components for bottom nav | components/icons/ |
| 4 | feat: replace emoji nav icons with SVG, amber active state | BottomNav.js, BottomNav.module.css |
| 5 | feat: redesign header with amber logobox and Rajdhani font | Header.js, Header.module.css |
| 6 | feat: redesign carpark cards with accent bars, flat badges, mono data fonts | ResultsList.module.css, globals.css |
| 7 | feat: update search panel amber focus states and font | SearchPanel.module.css |
| 8 | feat: update parked tab — amber timer, amber park button, progress bar CSS | parked.module.css |
| 9 | feat: sweep remaining tabs | 4 CSS files |
| 10 | feat: stagger card entry animation | ResultsList.js |
| 11 | feat: complete instrument cluster frontend redesign | cleanup |
