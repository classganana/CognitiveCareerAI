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
  goalFormSchema,
  type GoalFormValues,
} from "@/features/goals/schemas/goal-form.schema";
import {
  GOAL_PRIORITIES,
  GOAL_STATUSES,
  GoalPriority,
  GoalStatus,
} from "@/types/domain/goal";
import { formatGoalPriority, formatGoalStatus } from "@/utils/goal-labels";

type GoalFormProps = {
  defaultValues?: Partial<GoalFormValues>;
  onSubmit: (values: GoalFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

function toDateInputValue(value?: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export function GoalForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Goal",
}: GoalFormProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: GoalPriority.MEDIUM,
      status: GoalStatus.NOT_STARTED,
      targetDate: toDateInputValue(defaultValues?.targetDate),
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
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
            <Textarea id="description" rows={3} {...register("description")} />
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
                      {GOAL_PRIORITIES.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {formatGoalPriority(priority)}
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
                      {GOAL_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatGoalStatus(status)}
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

        <Field data-invalid={!!errors.targetDate}>
          <FieldLabel htmlFor="targetDate">Target Date (optional)</FieldLabel>
          <FieldContent>
            <Input id="targetDate" type="date" {...register("targetDate")} />
            <FieldError errors={[errors.targetDate]} />
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
