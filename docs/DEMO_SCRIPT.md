# Cognitive Career AI — Investor Demo Script

**Duration:** 5–10 minutes  
**Audience:** Investors and product stakeholders  
**Prerequisite:** Run `npm run seed:demo` before the demo

---

## 1. Opening — The Problem (1 min)

"Mentoring talent is high value but hard to scale. Most mentoring lives in scattered notes, calls, and memory. Cognitive Career AI turns mentoring into a structured, evidence-backed workflow that mentors can repeat and organizations can learn from."

Open the **Dashboard** at `/`.

---

## 2. Dashboard — Practice at a Glance (1 min)

Point out:

- **Quick Actions** — add mentee, start session, open knowledge repository
- **Live metrics** — mentees, career cases, meetings, observations, capabilities, goals, recommendations, knowledge claims
- **Recent Activity** — cross-case timeline showing the mentoring journey in motion

"This is not a static CRM. Every metric reflects real mentoring activity."

---

## 3. Mentees — Starting the Journey (1 min)

Navigate to **Mentees** (`/mentees`).

- Show the seeded mentees: Priya, Marcus, Elena, James
- Each represents a different career stage and mentoring story
- Click **Open Career Case** on **Priya Sharma**

---

## 4. Career Case Workspace — The Mentoring Hub (2 min)

On Priya's career case overview:

- **Career Snapshot** — mentee context plus assessment and goal/recommendation summary
- **Activity timeline** — audit trail of mentoring events

Walk through tabs:

1. **Meetings** — structured session history
2. Open the **Weekly Review** session
3. **Observations** — structured notes with severity and category
4. Show **Promote to Knowledge** vs **View Knowledge Claim** on observations

"This is where raw mentoring input becomes structured evidence."

---

## 5. Assessment & Action Plan (2 min)

Return to the career case:

- **Capabilities** — React assessed at Developing with linked observations
- **Goals** — portfolio project with automatic task progress
- Open goal detail — **Outstanding** vs **Completed** tasks
- **Recommendations** — coaching guidance tied to capability and goal

"Capabilities tell us where the mentee is. Goals define what to achieve. Recommendations explain why it matters."

---

## 6. Knowledge Repository — Organizational Memory (1 min)

Navigate to **Knowledge Repository** (`/knowledge-repository`).

- Show promoted knowledge claims with domain, validation status, confidence
- Open a validated claim — summary, tags, supporting evidence, linked observations
- Emphasize: knowledge is never created in isolation — it always originates from evidence

"This is the first step toward a mentor knowledge library and future AI intelligence."

---

## 7. Close — MVP Scope & Vision (1 min)

"What you've seen is a complete mentor workflow without AI bolted on prematurely. The data model is designed for a future where AI can summarize sessions, draft recommendations, and retrieve validated knowledge — all grounded in real mentoring evidence."

**Out of scope in MVP (future versions):**
- Authentication and multi-tenancy
- AI generation, embeddings, RAG
- Advanced analytics and notifications

---

## Demo Tips

- Use Priya for the deepest walkthrough (richest seeded data)
- Mention Marcus (career transition), Elena (staff track), James (job search) as breadth examples
- If asked about scale: single-tenant MVP with clean service layer ready for auth and org boundaries later
