/**
 * Demo seed script for Cognitive Career AI MVP.
 *
 * Usage:
 *   npm run seed:demo
 *
 * Requires MONGODB_URI in .env.local
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(envPath)) {
    return;
  }

  const contents = readFileSync(envPath, "utf8");

  for (const line of contents.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnv();

import {
  ActivityModel,
  CapabilityModel,
  CareerCaseModel,
  GoalModel,
  KnowledgeClaimEvidenceModel,
  KnowledgeClaimModel,
  MeetingModel,
  MenteeModel,
  ObservationModel,
  RecommendationModel,
  TaskModel,
} from "../src/models";
import { connectToDatabase } from "../src/lib/db/mongoose";
import { getDefaultMentorId } from "../src/lib/mentor/default-mentor";
import { deleteMenteeWithRelatedData } from "../src/services/mentee-cascade-delete";
import {
  ActivityEntityType,
  ActivityType,
} from "../src/types/domain/activity-enums";
import { CapabilityCategory } from "../src/types/domain/capability-category";
import { CareerCaseStatus } from "../src/types/domain/career-case";
import { GoalPriority, GoalStatus } from "../src/types/domain/goal";
import {
  KnowledgeDomain,
  KnowledgeValidationStatus,
} from "../src/types/domain/knowledge-domain";
import { MenteeStatus } from "../src/types/domain/mentee";
import { RecommendationStatus } from "../src/types/domain/recommendation";
import {
  CareerStage,
  CapabilityLevel,
  ObservationCategory,
  ObservationSeverity,
  SessionType,
} from "../src/types/enums";
import { logActivity } from "../src/services/activity.service";

async function resetDemoData() {
  const mentorId = await getDefaultMentorId();
  const mentees = await MenteeModel.find({ mentorId }).select("_id");

  for (const mentee of mentees) {
    await deleteMenteeWithRelatedData(mentee._id.toString());
  }

  await KnowledgeClaimEvidenceModel.deleteMany({});
  await KnowledgeClaimModel.deleteMany({});
}

async function seedDemo() {
  await connectToDatabase();
  console.log("Resetting existing demo data...");
  await resetDemoData();

  const mentorId = await getDefaultMentorId();
  console.log("Seeding demo mentoring stories...");

  const priya = await MenteeModel.create({
    mentorId,
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 43210",
    currentRole: "Junior Frontend Developer",
    targetRole: "Mid-Level React Engineer",
    careerStage: CareerStage.GROWTH,
    yearsOfExperience: 2,
    notes:
      "Strong learner with good fundamentals. Needs confidence in system design conversations and portfolio depth.",
    status: MenteeStatus.ACTIVE,
  });

  const priyaCase = await CareerCaseModel.create({
    menteeId: priya._id,
    title: "Priya Sharma's Career Case",
    stage: CareerStage.GROWTH,
    status: CareerCaseStatus.ACTIVE,
  });

  await logActivity({
    careerCaseId: priyaCase._id,
    type: ActivityType.CareerCaseCreated,
    title: "Career Case Created",
    actor: "Default Mentor",
    entityType: ActivityEntityType.CareerCase,
    entityId: priyaCase._id,
    metadata: { description: priya.fullName },
  });

  const priyaMeeting = await MeetingModel.create({
    careerCaseId: priyaCase._id,
    sessionDate: new Date("2026-07-10"),
    sessionType: SessionType.WEEKLY_REVIEW,
    durationMinutes: 60,
    summary:
      "Reviewed React component patterns and discussed portfolio project scope for the next four weeks.",
  });

  const priyaObservations = await ObservationModel.insertMany([
    {
      meetingId: priyaMeeting._id,
      title: "Strong component composition instincts",
      description:
        "Priya breaks UI into reusable pieces naturally and explains prop flow clearly during code walkthroughs.",
      category: ObservationCategory.TECHNICAL,
      severity: ObservationSeverity.MEDIUM,
    },
    {
      meetingId: priyaMeeting._id,
      title: "Needs deeper hooks practice",
      description:
        "Custom hooks are still inconsistent. useEffect dependency mistakes appeared twice in the sample code review.",
      category: ObservationCategory.LEARNING,
      severity: ObservationSeverity.HIGH,
    },
  ]);

  const reactCapability = await CapabilityModel.create({
    careerCaseId: priyaCase._id,
    name: "React",
    category: CapabilityCategory.TECHNICAL,
    level: CapabilityLevel.DEVELOPING,
    confidence: 68,
    notes: "Solid JSX and component patterns; hooks still emerging.",
    supportingObservations: [priyaObservations[1]._id],
    lastReviewedAt: new Date("2026-07-10"),
  });

  const priyaGoal = await GoalModel.create({
    careerCaseId: priyaCase._id,
    title: "Build portfolio-ready React project",
    description:
      "Deliver one polished full-stack React app that demonstrates hooks, routing, and API integration.",
    priority: GoalPriority.HIGH,
    status: GoalStatus.IN_PROGRESS,
    targetDate: new Date("2026-09-15"),
  });

  await TaskModel.insertMany([
    {
      goalId: priyaGoal._id,
      title: "Complete React Hooks course",
      description: "Finish the advanced hooks module and submit two practice exercises.",
      dueDate: new Date("2026-08-01"),
      completed: true,
    },
    {
      goalId: priyaGoal._id,
      title: "Build one portfolio project",
      description: "Ship a task manager app with auth, filters, and responsive layout.",
      dueDate: new Date("2026-09-01"),
      completed: false,
    },
  ]);

  await RecommendationModel.create({
    careerCaseId: priyaCase._id,
    title: "Pair custom hooks with real feature work",
    description:
      "Convert repeated state logic in the portfolio app into reusable hooks before adding new UI screens.",
    priority: GoalPriority.HIGH,
    status: RecommendationStatus.IN_PROGRESS,
    capabilityId: reactCapability._id,
    goalId: priyaGoal._id,
  });

  const priyaKnowledge = await KnowledgeClaimModel.create({
    title: "Junior engineers grow fastest when hooks practice is tied to shipping",
    statement:
      "Isolated tutorial completion helps, but mentees consolidate React hooks faster when each new hook is extracted from a feature they are actively building.",
    domain: KnowledgeDomain.LEARNING,
    tags: ["react", "hooks", "portfolio"],
    confidence: 82,
    validationStatus: KnowledgeValidationStatus.VALIDATED,
    archived: false,
    originCareerCaseId: priyaCase._id,
    evidenceIds: [],
  });

  const priyaEvidence = await KnowledgeClaimEvidenceModel.create({
    knowledgeClaimId: priyaKnowledge._id,
    observationId: priyaObservations[1]._id,
  });

  priyaKnowledge.evidenceIds.push(priyaEvidence._id);
  await priyaKnowledge.save();

  const marcus = await MenteeModel.create({
    mentorId,
    fullName: "Marcus Chen",
    email: "marcus.chen@example.com",
    phone: "+1 415 555 0198",
    currentRole: "Business Analyst",
    targetRole: "Associate Product Manager",
    careerStage: CareerStage.PREPARATION,
    yearsOfExperience: 4,
    notes: "Transitioning into product. Strong stakeholder communication, limited technical depth.",
    status: MenteeStatus.ACTIVE,
  });

  const marcusCase = await CareerCaseModel.create({
    menteeId: marcus._id,
    title: "Marcus Chen's Career Case",
    stage: CareerStage.PREPARATION,
    status: CareerCaseStatus.ACTIVE,
  });

  const marcusMeeting = await MeetingModel.create({
    careerCaseId: marcusCase._id,
    sessionDate: new Date("2026-07-05"),
    sessionType: SessionType.CAREER_PLANNING,
    durationMinutes: 75,
    summary:
      "Mapped a 90-day transition plan from business analysis to associate PM with focus on discovery skills.",
  });

  const marcusObservation = await ObservationModel.create({
    meetingId: marcusMeeting._id,
    title: "Clear product thinking in user journey mapping",
    description:
      "Marcus framed problems around user outcomes rather than feature requests during the mock discovery exercise.",
    category: ObservationCategory.CAREER_PLANNING,
    severity: ObservationSeverity.MEDIUM,
  });

  await CapabilityModel.create({
    careerCaseId: marcusCase._id,
    name: "Product Discovery",
    category: CapabilityCategory.BUSINESS,
    level: CapabilityLevel.EMERGING,
    confidence: 55,
    notes: "Promising framing, needs more interview reps.",
    supportingObservations: [marcusObservation._id],
    lastReviewedAt: new Date("2026-07-05"),
  });

  const marcusGoal = await GoalModel.create({
    careerCaseId: marcusCase._id,
    title: "Complete PM transition portfolio",
    description:
      "Produce two case studies showing discovery, prioritization, and stakeholder alignment.",
    priority: GoalPriority.MEDIUM,
    status: GoalStatus.NOT_STARTED,
    targetDate: new Date("2026-10-01"),
  });

  await TaskModel.create({
    goalId: marcusGoal._id,
    title: "Draft first PM case study",
    description: "Write a discovery-to-delivery narrative from a recent BA project.",
    dueDate: new Date("2026-08-20"),
    completed: false,
  });

  await RecommendationModel.create({
    careerCaseId: marcusCase._id,
    title: "Run two mock discovery interviews",
    description:
      "Practice open-ended customer interviews and synthesize insights into opportunity statements.",
    priority: GoalPriority.MEDIUM,
    status: RecommendationStatus.PENDING,
    goalId: marcusGoal._id,
  });

  const elena = await MenteeModel.create({
    mentorId,
    fullName: "Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    phone: "+44 7700 900123",
    currentRole: "Senior Software Engineer",
    targetRole: "Staff Engineer",
    careerStage: CareerStage.GROWTH,
    yearsOfExperience: 9,
    notes: "Ready for broader technical leadership. Needs stronger executive communication.",
    status: MenteeStatus.ACTIVE,
  });

  const elenaCase = await CareerCaseModel.create({
    menteeId: elena._id,
    title: "Elena Rodriguez's Career Case",
    stage: CareerStage.GROWTH,
    status: CareerCaseStatus.ACTIVE,
  });

  const elenaMeeting = await MeetingModel.create({
    careerCaseId: elenaCase._id,
    sessionDate: new Date("2026-07-12"),
    sessionType: SessionType.MONTHLY_REVIEW,
    durationMinutes: 90,
    summary:
      "Reviewed staff-level expectations, influence without authority, and architecture narrative for promotion packet.",
  });

  await ObservationModel.create({
    meetingId: elenaMeeting._id,
    title: "Strong technical depth in architecture reviews",
    description:
      "Elena articulates trade-offs clearly and connects decisions to business constraints in design discussions.",
    category: ObservationCategory.LEADERSHIP,
    severity: ObservationSeverity.HIGH,
  });

  await CapabilityModel.insertMany([
    {
      careerCaseId: elenaCase._id,
      name: "System Design",
      category: CapabilityCategory.TECHNICAL,
      level: CapabilityLevel.ADVANCED,
      confidence: 85,
      notes: "Consistently strong in review settings.",
      supportingObservations: [],
      lastReviewedAt: new Date("2026-07-12"),
    },
    {
      careerCaseId: elenaCase._id,
      name: "Executive Communication",
      category: CapabilityCategory.SOFT_SKILLS,
      level: CapabilityLevel.DEVELOPING,
      confidence: 62,
      notes: "Needs tighter narratives for leadership audiences.",
      supportingObservations: [],
      lastReviewedAt: new Date("2026-07-12"),
    },
  ]);

  const james = await MenteeModel.create({
    mentorId,
    fullName: "James Okonkwo",
    email: "james.okonkwo@example.com",
    phone: "+1 646 555 0142",
    currentRole: "Computer Science Graduate",
    targetRole: "Software Engineer I",
    careerStage: CareerStage.ACTIVE_SEARCH,
    yearsOfExperience: 0,
    notes: "Active job search. Strong algorithms knowledge, interview storytelling needs work.",
    status: MenteeStatus.ACTIVE,
  });

  const jamesCase = await CareerCaseModel.create({
    menteeId: james._id,
    title: "James Okonkwo's Career Case",
    stage: CareerStage.ACTIVE_SEARCH,
    status: CareerCaseStatus.ACTIVE,
  });

  const jamesMeeting = await MeetingModel.create({
    careerCaseId: jamesCase._id,
    sessionDate: new Date("2026-07-08"),
    sessionType: SessionType.MOCK_INTERVIEW,
    durationMinutes: 50,
    summary:
      "Conducted behavioral mock interview and reviewed STAR response structure for teamwork examples.",
  });

  const jamesObservation = await ObservationModel.create({
    meetingId: jamesMeeting._id,
    title: "Answers are accurate but too brief",
    description:
      "James identifies the right example quickly but skips context and measurable impact in behavioral responses.",
    category: ObservationCategory.COMMUNICATION,
    severity: ObservationSeverity.HIGH,
  });

  await RecommendationModel.create({
    careerCaseId: jamesCase._id,
    title: "Use STAR format in every behavioral answer",
    description:
      "Practice framing each answer with situation, task, action, and result to improve interview signal.",
    priority: GoalPriority.HIGH,
    status: RecommendationStatus.IN_PROGRESS,
  });

  const jamesKnowledge = await KnowledgeClaimModel.create({
    title: "Graduates improve interview outcomes with structured behavioral framing",
    statement:
      "Early-career candidates with strong technical knowledge often underperform in behavioral rounds until they consistently apply STAR framing with one quantified outcome per story.",
    domain: KnowledgeDomain.COMMUNICATION,
    tags: ["interviews", "behavioral", "early-career"],
    confidence: 76,
    validationStatus: KnowledgeValidationStatus.DRAFT,
    archived: false,
    originCareerCaseId: jamesCase._id,
    evidenceIds: [],
  });

  const jamesEvidence = await KnowledgeClaimEvidenceModel.create({
    knowledgeClaimId: jamesKnowledge._id,
    observationId: jamesObservation._id,
  });

  jamesKnowledge.evidenceIds.push(jamesEvidence._id);
  await jamesKnowledge.save();

  await ActivityModel.insertMany([
    {
      careerCaseId: priyaCase._id,
      type: ActivityType.MeetingCreated,
      title: "Meeting Created",
      actor: "Default Mentor",
      entityType: ActivityEntityType.Meeting,
      entityId: priyaMeeting._id,
      metadata: { description: "Weekly Review" },
    },
    {
      careerCaseId: priyaCase._id,
      type: ActivityType.CapabilityCreated,
      title: "Capability Created",
      actor: "Default Mentor",
      entityType: ActivityEntityType.Capability,
      entityId: reactCapability._id,
      metadata: { description: "React" },
    },
    {
      careerCaseId: priyaCase._id,
      type: ActivityType.KnowledgeClaimCreated,
      title: "Knowledge Claim Created",
      actor: "Default Mentor",
      entityType: ActivityEntityType.KnowledgeClaim,
      entityId: priyaKnowledge._id,
      metadata: { description: priyaKnowledge.title },
    },
  ]);

  console.log("Demo seed complete.");
  console.log("- 4 mentees with career cases");
  console.log("- Meetings, observations, capabilities, goals, tasks, recommendations");
  console.log("- 2 knowledge claims with evidence");
}

seedDemo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
