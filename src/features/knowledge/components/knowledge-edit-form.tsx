"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
  KNOWLEDGE_DOMAINS,
  KNOWLEDGE_VALIDATION_STATUSES,
  KnowledgeDomain,
  KnowledgeValidationStatus,
} from "@/types/domain/knowledge-domain";
import {
  formatKnowledgeDomain,
  formatKnowledgeValidationStatus,
} from "@/utils/knowledge-labels";

const knowledgeEditFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  summary: z.string().trim().min(1, "Summary is required"),
  domain: z.enum(KNOWLEDGE_DOMAINS as [KnowledgeDomain, ...KnowledgeDomain[]]),
  tagsInput: z.string().optional(),
  confidence: z.number().min(0).max(100),
  validationStatus: z.enum(
    KNOWLEDGE_VALIDATION_STATUSES as [
      KnowledgeValidationStatus,
      ...KnowledgeValidationStatus[],
    ],
  ),
});

export type KnowledgeEditFormValues = z.infer<typeof knowledgeEditFormSchema>;

type KnowledgeEditFormProps = {
  defaultValues: KnowledgeEditFormValues;
  onSubmit: (values: {
    title: string;
    summary: string;
    domain: KnowledgeDomain;
    tags: string[];
    confidence: number;
    validationStatus: KnowledgeValidationStatus;
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

function parseTagsInput(value?: string) {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function KnowledgeEditForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Changes",
}: KnowledgeEditFormProps) {
  const form = useForm<KnowledgeEditFormValues>({
    resolver: zodResolver(knowledgeEditFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  async function handleFormSubmit(values: KnowledgeEditFormValues) {
    await onSubmit({
      title: values.title,
      summary: values.summary,
      domain: values.domain,
      tags: parseTagsInput(values.tagsInput),
      confidence: values.confidence,
      validationStatus: values.validationStatus,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="edit-title">Title</FieldLabel>
          <FieldContent>
            <Input id="edit-title" {...register("title")} />
            <FieldError errors={[errors.title]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.summary}>
          <FieldLabel htmlFor="edit-summary">Summary</FieldLabel>
          <FieldContent>
            <Textarea id="edit-summary" rows={4} {...register("summary")} />
            <FieldError errors={[errors.summary]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.domain}>
          <FieldLabel>Domain</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="domain"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {KNOWLEDGE_DOMAINS.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {formatKnowledgeDomain(domain)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.domain]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-tags">Tags</FieldLabel>
          <FieldContent>
            <Input
              id="edit-tags"
              placeholder="Comma-separated tags"
              {...register("tagsInput")}
            />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.validationStatus}>
          <FieldLabel>Validation Status</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="validationStatus"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {KNOWLEDGE_VALIDATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatKnowledgeValidationStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.validationStatus]} />
          </FieldContent>
        </Field>

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
