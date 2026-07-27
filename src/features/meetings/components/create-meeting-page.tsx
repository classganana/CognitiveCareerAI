"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CreateMeetingForm } from "@/features/meetings/components/create-meeting-form";
import { createMeeting } from "@/features/meetings/lib/meeting-api";
import type { CreateMeetingFormValues } from "@/features/meetings/schemas/meeting-form.schema";

type CreateMeetingPageProps = {
  careerCaseId: string;
};

export function CreateMeetingPage({ careerCaseId }: CreateMeetingPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: CreateMeetingFormValues) {
    setIsSubmitting(true);

    try {
      const meeting = await createMeeting(careerCaseId, values);
      toast.success("Mentoring session created");
      router.push(`/career-cases/${careerCaseId}/meetings/${meeting._id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create session",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <CreateMeetingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  );
}
