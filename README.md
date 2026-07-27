# Cognitive Career AI

Mentor-first Career Case Management platform MVP.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB + Mongoose
- React Hook Form + Zod

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

4. (Optional) Seed demo data for investor walkthroughs:

```bash
npm run seed:demo
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Documentation

- [MVP Overview](./docs/MVP_OVERVIEW.md)
- [Investor Demo Script](./docs/DEMO_SCRIPT.md)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and layouts
├── components/          # Shared UI and layout components
│   ├── layout/          # App shell, sidebar, header
│   └── ui/              # shadcn/ui primitives
├── features/            # Feature-oriented modules
├── hooks/               # Shared React hooks
├── lib/                 # Core utilities (db, navigation, etc.)
├── models/              # Mongoose models
├── services/            # Business logic / data access
├── types/               # Shared TypeScript types
└── utils/               # Helper utilities
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/mentees` | Mentees |
| `/knowledge-repository` | Knowledge Repository |
| `/reports` | Reports |
| `/settings` | Settings |

## Notes

This MVP focuses on mentor case management. AI features are intentionally excluded and can be added in future iterations.
# CognitiveCareerAI
