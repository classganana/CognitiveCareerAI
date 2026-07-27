"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  observationFormSchema,
  type ObservationFormValues,
} from "@/features/meetings/schemas/observation-form.schema";
import {
  OBSERVATION_CATEGORIES,
  OBSERVATION_SEVERITIES,
  ObservationCategory,
  ObservationSeverity,
} from "@/types/enums";
import {
  formatObservationCategory,
  formatObservationSeverity,
} from "@/utils/session-labels";

type ObservationFormProps = {
  defaultValues?: Partial<ObservationFormValues>;
  onSubmit: (values: ObservationFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function ObservationForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Observation",
}: ObservationFormProps) {
  const form = useForm<ObservationFormValues>({
    resolver: zodResolver(observationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: ObservationCategory.TECHNICAL,
      severity: ObservationSeverity.MEDIUM,
      ...defaultValues,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      {OBSERVATION_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {formatObservationCategory(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.category]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.severity}>
            <FieldLabel>Severity</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="severity"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {OBSERVATION_SEVERITIES.map((severity) => (
                        <SelectItem key={severity} value={severity}>
                          {formatObservationSeverity(severity)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.severity]} />
            </FieldContent>
          </Field>
        </div>
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
