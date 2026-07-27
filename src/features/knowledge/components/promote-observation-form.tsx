"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import type { PromoteObservationValues } from "@/features/knowledge/schemas/promote-observation.schema";
import {
  KNOWLEDGE_DOMAINS,
  KnowledgeDomain,
} from "@/types/domain/knowledge-domain";
import { formatKnowledgeDomain } from "@/utils/knowledge-labels";

const promoteFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  summary: z.string().trim().min(1, "Summary is required"),
  domain: z.enum(KNOWLEDGE_DOMAINS as [KnowledgeDomain, ...KnowledgeDomain[]]),
  tagsInput: z.string().optional(),
});

type PromoteFormValues = z.infer<typeof promoteFormSchema>;

type PromoteObservationFormProps = {
  observationId: string;
  defaultTitle?: string;
  onSubmit: (values: PromoteObservationValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
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

export function PromoteObservationForm({
  observationId,
  defaultTitle = "",
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PromoteObservationFormProps) {
  const form = useForm<PromoteFormValues>({
    resolver: zodResolver(promoteFormSchema),
    defaultValues: {
      title: defaultTitle,
      summary: "",
      domain: KnowledgeDomain.TECHNICAL,
      tagsInput: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  async function handleFormSubmit(values: PromoteFormValues) {
    await onSubmit({
      observationId,
      title: values.title,
      summary: values.summary,
      domain: values.domain,
      tags: parseTagsInput(values.tagsInput),
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="knowledge-title">Knowledge Title</FieldLabel>
          <FieldContent>
            <Input id="knowledge-title" {...register("title")} />
            <FieldError errors={[errors.title]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.summary}>
          <FieldLabel htmlFor="knowledge-summary">Summary</FieldLabel>
          <FieldContent>
            <Textarea id="knowledge-summary" rows={4} {...register("summary")} />
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
          <FieldLabel htmlFor="knowledge-tags">Tags</FieldLabel>
          <FieldContent>
            <Input
              id="knowledge-tags"
              placeholder="Comma-separated tags"
              {...register("tagsInput")}
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Promoting..." : "Promote to Knowledge"}
        </Button>
      </div>
    </form>
  );
}
