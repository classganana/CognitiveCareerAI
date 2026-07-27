"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MenteeForm } from "@/features/mentees/components/mentee-form";
import { createMentee } from "@/features/mentees/lib/mentee-api";
import type { CreateMenteeFormValues } from "@/features/mentees/schemas/mentee-form.schema";

export function CreateMenteePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: CreateMenteeFormValues) {
    setIsSubmitting(true);

    try {
      const createValues: CreateMenteeFormValues = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        currentRole: values.currentRole,
        targetRole: values.targetRole,
        careerStage: values.careerStage,
        yearsOfExperience: values.yearsOfExperience,
        notes: values.notes,
      };
      await createMentee(createValues);
      toast.success("Mentee created successfully");
      router.push("/mentees");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create mentee",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MenteeForm
      mode="create"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
