# RentApp

A modern rental management platform built for small landlords, independent property managers, and DIY real estate investors.

## What is RentApp?

RentApp is a clean, opinionated SaaS platform that makes managing rental properties simple. Track properties, tenants, leases, and payments in one place — without the bloat of enterprise property management software.

**Built for:** Landlords with 1–50 units who want something simpler than AppFolio, more modern than Buildium, and cleaner than Rentec Direct.

## Features

- **Property Management** — Full CRUD with address, rent, and property details
- **Tenant Management** — Full CRUD with emergency contacts and employment info
- **Lease Tracking** — Full CRUD with property/tenant association, financial details, and date validation
- **Payment Tracking** — Full CRUD with lease association, payment stats, and status tracking
- **Dashboard** — At-a-glance stats, alerts for overdue payments and expiring leases, recent activity
- **Form Validation** — Zod schemas with react-hook-form for all entity forms
- **Responsive Design** — Works on desktop and mobile with collapsible sidebar
- **Dark Mode** — Built-in theme support

## Tech Stack

| Layer          | Technology                                       |
| -------------- | ------------------------------------------------ |
| Frontend       | Next.js 16 (App Router), React 19, TypeScript    |
| Backend        | NestJS 10, TypeScript                            |
| Database       | PostgreSQL, Prisma ORM                           |
| UI             | shadcn/ui (Radix), Tailwind CSS v4, Lucide icons |
| Monorepo       | Turborepo, pnpm workspaces                       |
| Infrastructure | Docker Compose (PostgreSQL, Redis)               |

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9+
- Docker (for PostgreSQL and Redis)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd rent-app
pnpm install

# Start database services
docker compose up -d

# Configure environment
cp .env.example apps/api/.env.local
# Edit apps/api/.env.local with your DATABASE_URL and JWT_SECRET

# Set up database
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed    # Seeds demo data
cd ../..

# Start development
pnpm dev
```

The web app runs at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:3001/api](http://localhost:3001/api).

**Demo credentials:** demo@rentapp.com / password123

### Useful Commands

```bash
pnpm dev                  # Run all apps
pnpm build                # Build everything
pnpm lint                 # Lint all packages
pnpm check-types          # Type check all packages
pnpm format               # Format code with Prettier
pnpm --filter web dev     # Run only frontend
pnpm --filter api dev     # Run only backend
```

## Project Structure

```
rent-app/
├── apps/
│   ├── api/              # NestJS backend API
│   └── web/              # Next.js frontend
├── packages/
│   ├── ui/               # Shared component library (shadcn/ui)
│   ├── shared/           # Shared types, utils, constants
│   ├── eslint-config/    # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
└── docker-compose.yml    # PostgreSQL + Redis
```

## Architecture Decisions

**Why a separate NestJS backend instead of Next.js API routes?**

The rental domain (properties, tenants, leases, payments, maintenance) benefits from structured backend architecture. NestJS provides modules, dependency injection, clean service layers, and DTO validation. This also keeps the backend framework-agnostic — supporting future mobile apps, public APIs, and third-party integrations.

**Why a monorepo?**

Shared types ensure the frontend and backend stay in sync. Shared UI components enforce design consistency. One repo, one CI pipeline, one source of truth.

## Roadmap

- Maintenance request tracking
- Document storage and management
- Stripe payment integration
- Email and SMS notifications
- Mobile app (React Native)
- Public tenant portal
- AI-powered insights and automation

## License

Private — All rights reserved.
