# Phase 5: Organ Matching & Tracking Implementation Plan

## Overview
This phase builds the operational view for the Organ donation lifecycle, consuming the existing mock endpoints and adhering to strict clinical decision-support principles (the frontend surfaces data but does not assert clinical authority).

## File Structure & Routing
We will replace the generic `ModuleBoundary` in `/organ` with a rich operational dashboard and dedicated feature routes.

### Routes (in `src/app/(portal)/organ/`)
- `page.tsx`: Organ Overview
- `matches/page.tsx`: Matches List
- `matches/[matchId]/page.tsx`: Match Detail
- `waiting-list/page.tsx`: Recipient Waiting List
- `ischemia/page.tsx`: Cold-Ischemia Tracker
- `living-donors/page.tsx`: Living Donor Registry (Staff View)

### Feature Components (in `src/features/organ/components/`)
- `organ-overview-cards.tsx`: Summary metrics
- `organ-match-list.tsx`: Ranked match table
- `match-factor-breakdown.tsx`: Display of the 4 compatibility factors
- `waiting-list-table.tsx`: Ranked list of patients
- `ischemia-countdown.tsx`: Semantic timer for transit organs
- `living-donor-table.tsx`: Privacy-focused view

## Implementation Details

### 1. Organ Overview
- Fetch metrics via `useOrganOverview()`.
- Use existing `StatCard` components.
- Provide quick links to the sub-sections.

### 2. Match List & Detail
- `/organ/matches`: A `DataTableShell` mapping `OrganMatch` objects. Rank is visually prominent.
- `/organ/matches/[matchId]`: A decision-support view mapping donor/recipient context and the four compatibility factors (Blood Group, HLA, Urgency, Distance). Use visual gauges (e.g. `div` progress bars) to reflect the `overallCompatibilityScore`.

### 3. Waiting List
- `/organ/waiting-list`: A table driven by `useWaitingList()`.
- Renders `priorityRank`, `meldScore`, and time waiting.
- Re-ordering is strictly display-only or relies on backend sorting; no drag-and-drop.

### 4. Cold-Ischemia Tracker
- `/organ/ischemia`: Cards or list for `useOrganTransit()`.
- **Countdown Component**: Given `expiresAt`, computes remaining time and applies semantic status (`SAFE`, `WARNING`, `CRITICAL`, `EXPIRED`). Uses a `setInterval` that cleans up on unmount.

### 5. Living Donor Registry
- `/organ/living-donors`: Table driven by `useLivingDonors()`.
- Renders `anonymousReference`, `organInterest`, and `screeningStatus`. Does not expose direct PII.

## Security & Navigation
- All routes are protected under the `organ.match.read` (or `organ.waitlist.read` etc) permissions as defined in `src/config/routes.ts`.
- Navigation sidebar remains clean; breadcrumbs provide internal module orientation.

## Verification
- Unit/component tests will be added in `src/test/features/organ/`.
- Ensure `npm run lint`, `typecheck`, `test`, and `build` succeed cleanly.
