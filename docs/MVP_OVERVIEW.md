# Cognitive Career AI — MVP Overview

## Product Vision

Cognitive Career AI is a mentor-first Career Case Management platform. It helps mentors turn unstructured mentoring conversations into structured career development workflows — from session notes and observations to capability assessments, goals, recommendations, and reusable organizational knowledge.

The long-term vision is to layer AI on top of this evidence-backed mentoring graph. The MVP deliberately excludes AI generation so the core workflow can be validated first.

## Feature Overview

| Area | Capability |
|------|-------------|
| **Dashboard** | Live mentoring metrics, recent activity feed, quick actions |
| **Mentees** | CRUD, search, career case auto-creation |
| **Career Case Workspace** | Overview, meetings, observations, capabilities, goals, recommendations |
| **Mentoring Sessions** | Session logging with structured observations |
| **Capability Assessment** | Skill evaluation with confidence and evidence links |
| **Goals & Tasks** | Development goals with automatic progress tracking |
| **Recommendations** | Mentor coaching guidance linked to capabilities and goals |
| **Knowledge Repository** | Promote observations into reusable knowledge claims with evidence |

## Architecture Summary

Single Next.js 15 application using the App Router. Business logic lives in service modules; Mongoose models map to MongoDB collections. UI is built with shadcn/ui and Tailwind CSS. Forms use React Hook Form + Zod validation.

```
Browser → Next.js pages/API routes → Services → Mongoose → MongoDB
```

Activity events are append-only and power the timeline on the career case overview and dashboard feed.

## Folder Structure

```
src/
├── app/                    # Routes and API handlers
├── components/             # Shared layout and UI primitives
├── features/               # Feature-specific UI and schemas
├── lib/                    # Database, API helpers, navigation
├── models/                 # Mongoose schemas
├── services/               # Business logic
├── types/                  # Domain and shared TypeScript types
└── utils/                  # Formatting and label helpers
```

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS, shadcn/ui, Lucide icons
- **Database:** MongoDB with Mongoose
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner toasts

## Demo Walkthrough

1. Run `npm run seed:demo` to populate realistic mentoring data.
2. Open the **Dashboard** — review live metrics and recent activity.
3. Go to **Mentees** — open Priya Sharma's career case.
4. Walk through **Meetings → Session Details → Observations**.
5. Review **Capabilities** and **Goals** with task progress.
6. Open **Recommendations** for coaching guidance.
7. Visit **Knowledge Repository** — show promoted knowledge with evidence.

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for a full investor walkthrough.

## Future Roadmap

- Authentication and multi-mentor workspaces
- AI-assisted observation summarization and recommendation drafting
- Embeddings and semantic search over knowledge claims
- Knowledge graph and RAG-powered mentor copilot
- Notifications, email digests, and organization-level analytics
- Reports and advanced dashboard analytics
