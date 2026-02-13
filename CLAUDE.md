# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RentApp is a rental management SaaS platform for small landlords (1–50 units), independent property managers, and DIY real estate investors. Built by a solo technical founder as a serious SaaS product with clean UX, opinionated workflows, and developer-quality architecture.

**Design philosophy:** Opinionated UX over feature bloat. Clean UI over cluttered dashboards. Automation over manual tracking. Simplicity over configurability.

## Architecture

Turborepo monorepo with pnpm workspaces. Two apps, four shared packages.

```
apps/
  api/          → NestJS 10 backend (port 3001, prefix /api)
  web/          → Next.js 16 frontend (App Router, React 19)
packages/
  ui/           → shadcn/ui component library (Radix Nova style, Tailwind v4)
  shared/       → Types, utils (currency, date, validation), constants
  eslint-config/ → Shared ESLint configs (base, next, react-internal)
  typescript-config/ → Shared tsconfig (base, nextjs, react-library)
```

## Commands

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Run all apps in dev mode
pnpm build                # Build all apps and packages
pnpm lint                 # Lint all packages
pnpm check-types          # TypeScript type checking across workspace
pnpm format               # Prettier format all files

# Filtered commands
pnpm --filter web dev     # Run only the web app
pnpm --filter api dev     # Run only the API
pnpm --filter web build   # Build only the web app

# Database
cd apps/api
pnpm prisma generate      # Generate Prisma client
pnpm prisma migrate dev   # Run migrations
pnpm prisma db seed       # Seed demo data (demo@rentapp.com / password123)
pnpm prisma studio        # Open Prisma Studio

# Infrastructure
docker compose up -d      # Start PostgreSQL + Redis
```

## Backend (apps/api)

NestJS with module-based architecture. Each domain entity has its own module with controller, service, DTO, and module file.

```
src/
  auth/         → JWT auth (register, login, profile). Guards, decorators, strategies.
  properties/   → CRUD with filtering (status, type, city, rent range)
  tenants/      → CRUD with lease associations
  leases/       → CRUD with document support
  payments/     → CRUD with summary endpoint
  dashboard/    → Aggregated stats, recent activity, financial summary
  prisma/       → Database service (PrismaService with lifecycle management)
```

**Conventions:**
- Business logic lives in services, never in controllers
- DTOs use class-validator decorators for validation
- Global validation pipe with whitelist and transform enabled
- `@CurrentUser()` decorator extracts user from JWT
- `@Public()` decorator bypasses auth guard
- All entities are scoped to owner (multi-tenant by ownerId)

**Database:** PostgreSQL via Prisma ORM. Schema at `apps/api/prisma/schema.prisma`.

**Core entities:** User, Property, Tenant, Lease, LeaseDocument, Payment, Reminder

## Frontend (apps/web)

Next.js 16 with App Router and Turbopack. Client-side auth with JWT stored in localStorage.

```
app/
  login/              → Public login page
  register/           → Public registration page
  dashboard/          → Protected layout with sidebar
    page.tsx          → Overview with stats, alerts, recent activity
    properties/       → Property list with DataTable
    tenants/          → Tenant list with DataTable
    leases/           → Lease list with DataTable
    payments/         → Payment list with stats + DataTable
components/
  layout/sidebar.tsx  → Navigation sidebar (responsive)
  ui/stat-card.tsx    → Dashboard stat card (composes @repo/ui Card)
lib/
  api.ts              → API client (base URL: localhost:3001/api)
  auth-context.tsx    → Auth state provider (React Context)
  get-status-variant.ts → Maps entity statuses to Badge variants
```

**Conventions:**
- All dashboard pages are client components ('use client')
- DataTable columns use @tanstack/react-table `ColumnDef` pattern
- UI components import from `@repo/ui/components/*`
- Utility functions import from `@repo/shared/utils`
- `cn()` utility imported from `@repo/ui/lib/utils`
- Icons from `lucide-react`
- Transpiled packages: @repo/shared, @repo/ui (configured in next.config.js)

## Shared UI Package (packages/ui)

shadcn/ui with Radix Nova style. Tailwind CSS v4 with oklch color variables.

**Components:** Badge, Button, Card (Card/CardHeader/CardTitle/CardContent/CardFooter), DataTable, Table

**Adding shadcn components:**
```bash
pnpm dlx shadcn@latest add <component> -c packages/ui
```

Components are exported via package.json exports map: `@repo/ui/components/*`, `@repo/ui/lib/*`, `@repo/ui/hooks/*`.

## Shared Package (packages/shared)

Types mirror Prisma enums and entity shapes. Exports: `@repo/shared/types`, `@repo/shared/utils`, `@repo/shared/constants`.

**Key utils:** `formatCurrency()`, `formatDate()`, validation helpers.

## Environment Variables

See `.env.example`. Required for API: `DATABASE_URL`, `JWT_SECRET`. Docker Compose provides PostgreSQL (5432) and Redis (6379).

## Code Style

- TypeScript strict mode throughout
- Prettier: single quotes, semicolons, trailing commas (es5), 80 char width
- ESLint with TypeScript and Prettier integration
- No default exports except Next.js pages/layouts
