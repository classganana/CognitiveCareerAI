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
} from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { isValidObjectId } from "@/features/mentees/lib/serialize-mentee";

export async function deleteMenteeWithRelatedData(menteeId: string): Promise<boolean> {
  if (!isValidObjectId(menteeId)) {
    return false;
  }

  await connectToDatabase();

  const mentee = await MenteeModel.findById(menteeId);

  if (!mentee) {
    return false;
  }

  const careerCases = await CareerCaseModel.find({ menteeId: mentee._id }).select("_id");
  const careerCaseIds = careerCases.map((careerCase) => careerCase._id);

  if (careerCaseIds.length > 0) {
    const meetings = await MeetingModel.find({
      careerCaseId: { $in: careerCaseIds },
    }).select("_id");
    const meetingIds = meetings.map((meeting) => meeting._id);

    if (meetingIds.length > 0) {
      const observations = await ObservationModel.find({
        meetingId: { $in: meetingIds },
      }).select("_id");
      const observationIds = observations.map((observation) => observation._id);

      if (observationIds.length > 0) {
        const evidenceRecords = await KnowledgeClaimEvidenceModel.find({
          observationId: { $in: observationIds },
        }).select("_id knowledgeClaimId");

        if (evidenceRecords.length > 0) {
          await Promise.all(
            evidenceRecords.map((evidence) =>
              KnowledgeClaimModel.updateOne(
                { _id: evidence.knowledgeClaimId },
                { $pull: { evidenceIds: evidence._id } },
              ),
            ),
          );

          await KnowledgeClaimEvidenceModel.deleteMany({
            _id: { $in: evidenceRecords.map((evidence) => evidence._id) },
          });
        }

        await ObservationModel.deleteMany({ _id: { $in: observationIds } });
      }

      await MeetingModel.deleteMany({ _id: { $in: meetingIds } });
    }

    const goals = await GoalModel.find({
      careerCaseId: { $in: careerCaseIds },
    }).select("_id");
    const goalIds = goals.map((goal) => goal._id);

    if (goalIds.length > 0) {
      await TaskModel.deleteMany({ goalId: { $in: goalIds } });
      await GoalModel.deleteMany({ _id: { $in: goalIds } });
    }

    await CapabilityModel.deleteMany({ careerCaseId: { $in: careerCaseIds } });
    await RecommendationModel.deleteMany({ careerCaseId: { $in: careerCaseIds } });
    await ActivityModel.deleteMany({ careerCaseId: { $in: careerCaseIds } });
    await CareerCaseModel.deleteMany({ _id: { $in: careerCaseIds } });
  }

  await MenteeModel.findByIdAndDelete(mentee._id);

  return true;
}
