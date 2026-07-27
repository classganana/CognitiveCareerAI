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
  createMeetingSchema,
  type CreateMeetingFormValues,
} from "@/features/meetings/schemas/meeting-form.schema";
import { SESSION_TYPES, SessionType } from "@/types/enums";
import { formatSessionType } from "@/utils/session-labels";

type CreateMeetingFormProps = {
  onSubmit: (values: CreateMeetingFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

function toDateTimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function CreateMeetingForm({
  onSubmit,
  isSubmitting = false,
}: CreateMeetingFormProps) {
  const form = useForm<CreateMeetingFormValues>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      sessionDate: toDateTimeLocalValue(new Date()),
      sessionType: SessionType.WEEKLY_REVIEW,
      durationMinutes: 60,
      summary: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Field data-invalid={!!errors.sessionDate}>
          <FieldLabel htmlFor="sessionDate">Session Date</FieldLabel>
          <FieldContent>
            <Input id="sessionDate" type="datetime-local" {...register("sessionDate")} />
            <FieldError errors={[errors.sessionDate]} />
          </FieldContent>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!errors.sessionType}>
            <FieldLabel>Session Type</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="sessionType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SESSION_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {formatSessionType(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.sessionType]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.durationMinutes}>
            <FieldLabel htmlFor="durationMinutes">Duration (minutes)</FieldLabel>
            <FieldContent>
              <Input
                id="durationMinutes"
                type="number"
                min={1}
                {...register("durationMinutes", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.durationMinutes]} />
            </FieldContent>
          </Field>
        </div>

        <Field data-invalid={!!errors.summary}>
          <FieldLabel htmlFor="summary">Summary</FieldLabel>
          <FieldContent>
            <Textarea id="summary" rows={5} {...register("summary")} />
            <FieldError errors={[errors.summary]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Session"}
        </Button>
      </div>
    </form>
  );
}
