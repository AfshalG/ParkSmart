# Project: ParkSmart — Singapore Parking Optimizer

## What Exists (built by friend — minimal, may need refactoring)
- Next.js 14 app (JavaScript, NOT TypeScript)
- LTA DataMall API integration for real-time carpark availability
- OneMap API for Singapore geocoding
- Leaflet map with numbered markers
- Scoring engine ranking carparks by cost, distance, availability
- Built-in Singapore parking rates (HDB, URA, LTA)
- Google Maps navigation links

## Current Tech Stack (already in place)
- Next.js 14 (React + API routes)
- JavaScript (no TypeScript)
- Leaflet for maps
- CSS (no Tailwind)
- No database — all real-time API calls
- No auth

## Known Issues To Assess
- .idea folder is committed (should be gitignored)
- Only 3 commits — likely no proper structure
- JavaScript not TypeScript — decide if migration is worth it
- No tests
- No error handling assessment done yet
- No loading states or error UI likely

## What I Want To Do (V1 Scope)
- Convert to mobile app using Capacitor (Android + iOS) while keeping Next.js
- Refactor and clean up existing codebase (gitignore, error handling, structure)
- Add "I'm Parked Here" — pin drop, timer, navigate back to car
- Add time-aware recommendations — "wait 15 min for evening rates"
- Add favourite/regular carparks with smart suggestions based on availability
- Add monthly parking spend tracker
- Improve UI/UX for mobile — bottom nav, swipe gestures, proper mobile layout
- Push notifications for parking timer expiry

## Future (V2+)
- Trip-based parking optimizer (multiple destinations)
- "Park Once" mode for clustered destinations
- ERP cost integration
- Carpark availability prediction from historical data
- Community "I'm leaving" feature

## Approach
- DO NOT rewrite from scratch — improve what exists
- First understand the full codebase before changing anything
- Fix fundamentals first (gitignore, error handling, structure)
- Then add features incrementally

## Decision Process
Before any major refactor or new technology:
1. Explain what's wrong with the current approach
2. Propose the change with tradeoffs
3. Wait for my approval
