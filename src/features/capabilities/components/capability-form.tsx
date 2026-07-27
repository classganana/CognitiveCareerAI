"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  capabilityFormSchema,
  type CapabilityFormValues,
} from "@/features/capabilities/schemas/capability-form.schema";
import { fetchCareerCaseObservations } from "@/features/capabilities/lib/capability-api";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";
import {
  CAPABILITY_CATEGORIES,
  CapabilityCategory,
} from "@/types/domain/capability-category";
import { CAPABILITY_LEVELS, CapabilityLevel } from "@/types/enums";
import {
  formatCapabilityCategory,
  formatCapabilityLevel,
} from "@/utils/capability-labels";
import { formatObservationCategory } from "@/utils/session-labels";

type CapabilityFormProps = {
  careerCaseId: string;
  defaultValues?: Partial<CapabilityFormValues>;
  onSubmit: (values: CapabilityFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function CapabilityForm({
  careerCaseId,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Capability",
}: CapabilityFormProps) {
  const [observations, setObservations] = useState<SerializedObservation[]>([]);
  const [isLoadingObservations, setIsLoadingObservations] = useState(true);

  const form = useForm<CapabilityFormValues>({
    resolver: zodResolver(capabilityFormSchema),
    defaultValues: {
      name: "",
      category: CapabilityCategory.TECHNICAL,
      level: CapabilityLevel.DEVELOPING,
      confidence: 50,
      notes: "",
      supportingObservations: [],
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedObservations = watch("supportingObservations");

  useEffect(() => {
    async function loadObservations() {
      try {
        const data = await fetchCareerCaseObservations(careerCaseId);
        setObservations(data);
      } finally {
        setIsLoadingObservations(false);
      }
    }

    loadObservations();
  }, [careerCaseId]);

  function toggleObservation(observationId: string, checked: boolean) {
    const current = selectedObservations ?? [];

    if (checked) {
      setValue("supportingObservations", [...current, observationId], {
        shouldValidate: true,
      });
      return;
    }

    setValue(
      "supportingObservations",
      current.filter((id) => id !== observationId),
      { shouldValidate: true },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <FieldContent>
            <Input id="name" placeholder="e.g. React, Communication" {...register("name")} />
            <FieldError errors={[errors.name]} />
          </FieldContent>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!errors.category}>
            <FieldLabel>Category</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAPABILITY_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {formatCapabilityCategory(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.category]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.level}>
            <FieldLabel>Level</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="level"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAPABILITY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {formatCapabilityLevel(level)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.level]} />
            </FieldContent>
          </Field>
        </div>

        <Field data-invalid={!!errors.confidence}>
          <FieldLabel>Confidence ({watch("confidence")}%)</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="confidence"
              render={({ field }) => (
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => {
                    const next = Array.isArray(value) ? value[0] : value;
                    field.onChange(next ?? 0);
                  }}
                />
              )}
            />
            <FieldError errors={[errors.confidence]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.notes}>
          <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
          <FieldContent>
            <Textarea id="notes" rows={3} {...register("notes")} />
            <FieldError errors={[errors.notes]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Supporting Observations</FieldLabel>
          <FieldContent>
            {isLoadingObservations ? (
              <p className="text-sm text-muted-foreground">Loading observations...</p>
            ) : observations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No observations available. Log mentoring sessions first.
              </p>
            ) : (
              <div className="max-h-48 space-y-3 overflow-y-auto rounded-lg border p-3">
                {observations.map((observation) => {
                  const checked = selectedObservations.includes(observation._id);

                  return (
                    <label
                      key={observation._id}
                      className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleObservation(observation._id, value === true)
                        }
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{observation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatObservationCategory(observation.category)}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
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
