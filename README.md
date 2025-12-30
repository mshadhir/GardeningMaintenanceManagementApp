# Gardening Maintenance Management App

Production-ready web app for managing gardening sites, tasks, schedules, and a map view built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Firebase (Auth + Firestore), and Google Maps API.

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Provide environment variables (see `.env.example`) and run the dev server:
   ```bash
   npm run dev
   ```

## Environment variables
Create a `.env.local` file with your Firebase and Google Maps credentials. See `.env.example` for required keys.

### Firebase setup
- Add the `NEXT_PUBLIC_FIREBASE_*` keys to `.env.local`.
- Deploy security rules with `firebase deploy --only firestore:rules`.
- Collections (baseline):
  - `sites`: site profiles, health/status, location, contact.
  - `tasks`: tasks linked to `siteId`, priority, status, due date.
  - `schedule`: scheduled visits referencing `siteId` and task IDs.
  - `visitLogs`: visit outcomes, notes, photos, completed tasks.
  - `userRoles`: role definitions/metadata (admin, worker, etc.).

### Firestore security rules (admin vs worker)
- Admins (`request.auth.token.role == "admin"`): full read/write across collections.
- Workers (`request.auth.token.role == "worker"`):
  - Read: all collections.
  - Write: create/update `tasks` and `visitLogs`; no deletes; no writes to `sites`, `schedule`, or `userRoles`.
  - Deletes and role management remain admin-only.

## Features
- Dashboard with key metrics for sites, tasks, and scheduled visits.
- Sites list with health/status and visit info.
- Task board with category filtering and quick status updates.
- Schedule overview and integrated Google Maps view for site locations.
