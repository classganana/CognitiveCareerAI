"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { fetchCapabilities } from "@/features/capabilities/lib/capability-api";
import { fetchGoals } from "@/features/goals/lib/goal-api";
import {
  recommendationFormSchema,
  type RecommendationFormValues,
} from "@/features/recommendations/schemas/recommendation-form.schema";
import {
  RECOMMENDATION_PRIORITIES,
  RECOMMENDATION_STATUSES,
  RecommendationStatus,
} from "@/types/domain/recommendation";
import { GoalPriority } from "@/types/domain/goal";
import {
  formatRecommendationPriority,
  formatRecommendationStatus,
} from "@/utils/recommendation-labels";

type RecommendationFormProps = {
  careerCaseId: string;
  defaultValues?: Partial<RecommendationFormValues>;
  onSubmit: (values: RecommendationFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function RecommendationForm({
  careerCaseId,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Recommendation",
}: RecommendationFormProps) {
  const [capabilityOptions, setCapabilityOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [goalOptions, setGoalOptions] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: GoalPriority.MEDIUM,
      status: RecommendationStatus.PENDING,
      capabilityId: "",
      goalId: "",
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    async function loadOptions() {
      try {
        const [capabilities, goals] = await Promise.all([
          fetchCapabilities(careerCaseId),
          fetchGoals(careerCaseId),
        ]);

        setCapabilityOptions(
          capabilities.map((capability) => ({
            value: capability._id,
            label: capability.name,
          })),
        );
        setGoalOptions(
          goals.map((goal) => ({
            value: goal._id,
            label: goal.title,
          })),
        );
      } finally {
        setIsLoadingOptions(false);
      }
    }

    loadOptions();
  }, [careerCaseId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <FieldContent>
            <Input id="title" {...register("title")} />
            <FieldError errors={[errors.title]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <FieldContent>
            <Textarea id="description" rows={4} {...register("description")} />
            <FieldError errors={[errors.description]} />
          </FieldContent>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors.priority}>
            <FieldLabel>Priority</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECOMMENDATION_PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {formatRecommendationPriority(priority)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.priority]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.status}>
            <FieldLabel>Status</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {RECOMMENDATION_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatRecommendationStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.status]} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Related Capability (optional)</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="capabilityId"
              render={({ field }) => (
                <SearchableSelect
                  options={capabilityOptions}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Search capabilities..."
                  emptyLabel={
                    isLoadingOptions
                      ? "Loading capabilities..."
                      : "No capabilities found"
                  }
                  disabled={isLoadingOptions}
                />
              )}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Related Goal (optional)</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="goalId"
              render={({ field }) => (
                <SearchableSelect
                  options={goalOptions}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  placeholder="Search goals..."
                  emptyLabel={
                    isLoadingOptions ? "Loading goals..." : "No goals found"
                  }
                  disabled={isLoadingOptions}
                />
              )}
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
