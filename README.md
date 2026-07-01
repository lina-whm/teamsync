# TeamSync — Kanban Task Management Dashboard

Agile task tracking with sprint analytics, drag-and-drop board, and team management.

**Production:** https://teamsync-psi.vercel.app  
**Demo credentials:** `admin@teamsync.dev` / `password123`

## Stack

- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript 5.x
- **State**: Effector 23 + Farfetched 0.11 + TanStack React Query 5
- **Auth**: NextAuth v5 (Credentials)
- **Database**: Turso (serverless SQLite) via Prisma 5 + driver adapters
- **UI**: Tailwind CSS 3 + Lucide React
- **Drag & Drop**: @dnd-kit/core 6
- **Charts**: Recharts 2
- **Forms**: React Hook Form + Zod
- **Tests**: Vitest + Testing Library + Playwright + MSW

## Getting Started

```bash
# Install dependencies
npm install

# Setup local SQLite database
npx prisma db push
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure (FSD)

```
src/
├── app/            # Next.js pages & API routes
├── entities/       # Business entities (task, sprint, user)
├── features/       # User features (auth, create-task, filter, drag-drop)
├── shared/         # Shared utilities, API client, types
├── widgets/        # Complex UI widgets (kanban-board, sprint-analytics)
└── tests/          # Unit & integration tests
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check |
| `npm test` | Run unit/integration tests |
| `npm run test:coverage` | Tests with coverage |
| `npm run test:e2e` | E2E Playwright tests |
| `npm run db:push` | Push Prisma schema |
| `npm run db:seed` | Seed database |

## Testing

### Unit & Integration (Vitest + RTL + MSW)

```bash
npm test            # Run once
npm run test:watch  # Watch mode
```

MSW v2 intercepts all API calls. Fixtures are in `src/tests/mocks/fixtures/`.

### E2E (Playwright)

```bash
npm run test:e2e        # Headless
npm run test:e2e:ui     # With Playwright UI
```

Auth fixture auto-logs in as admin for authenticated tests.

## CI/CD

- **CI**: lint → test (coverage) → build on every PR/merge to main/develop
- **E2E**: runs Playwright tests on PRs to main
- **Vercel**: automatic deployment from main branch

## Architecture Decisions

- **Effector + Farfetched**: cache-bypass via `__.lowLevelAPI.pushData` instead of `revalidate`
- **Auth**: JWT strategy with `session.user.image` from DB avatar field
- **Optimistic updates**: drag-drop updates UI immediately via TanStack React Query, rolls back on error
- **FSD layers**: `shared → entities → features → widgets → app`; public API only via `index.ts`

## Deploy to Vercel

1. **Create Turso database** (or use existing):

   ```bash
   npm install -g turso
   turso auth login
   turso db create teamsync
   turso db show teamsync --url        # → TURSO_DATABASE_URL
   turso db tokens create teamsync     # → TURSO_AUTH_TOKEN
   ```

2. **Push schema and seed**:

   ```bash
   TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npx tsx prisma/push-turso.ts
   TURSO_DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." npx tsx prisma/seed-turso.ts
   ```

3. **Set environment variables in Vercel:**

   | Variable | Value |
   |----------|-------|
   | `TURSO_DATABASE_URL` | `libsql://your-db.turso.io` |
   | `TURSO_AUTH_TOKEN` | Your Turso auth token |
   | `AUTH_SECRET` | Random 64-char hex (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `AUTH_URL` | `https://your-app.vercel.app` |

4. **Deploy:**

   ```bash
   npx vercel --prod
   ```

### Local development

Uses SQLite via `file:./dev.db` — no Turso needed. Set in `.env`:

```env
TURSO_DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-local-secret"
AUTH_URL="http://localhost:3000"
```
