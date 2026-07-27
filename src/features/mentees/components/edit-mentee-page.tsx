"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MenteeForm } from "@/features/mentees/components/mentee-form";
import { updateMentee } from "@/features/mentees/lib/mentee-api";
import type { SerializedMentee } from "@/features/mentees/lib/serialize-mentee";
import type { UpdateMenteeFormValues } from "@/features/mentees/schemas/mentee-form.schema";

type EditMenteePageProps = {
  mentee: SerializedMentee;
};

export function EditMenteePage({ mentee }: EditMenteePageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: UpdateMenteeFormValues) {
    setIsSubmitting(true);

    try {
      await updateMentee(mentee._id, values);
      toast.success("Mentee updated successfully");
      router.push(`/mentees/${mentee._id}`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update mentee",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MenteeForm
      mode="edit"
      defaultValues={{
        fullName: mentee.fullName,
        email: mentee.email,
        phone: mentee.phone,
        currentRole: mentee.currentRole,
        targetRole: mentee.targetRole,
        careerStage: mentee.careerStage,
        yearsOfExperience: mentee.yearsOfExperience,
        notes: mentee.notes ?? "",
        status: mentee.status,
      }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
