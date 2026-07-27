"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  taskFormSchema,
  type TaskFormValues,
} from "@/features/goals/schemas/task-form.schema";

type TaskFormProps = {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  showCompletedField?: boolean;
};

function toDateInputValue(value?: string) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Task",
  showCompletedField = false,
}: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: toDateInputValue(defaultValues?.dueDate),
      completed: false,
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
          <FieldLabel htmlFor="task-title">Title</FieldLabel>
          <FieldContent>
            <Input id="task-title" {...register("title")} />
            <FieldError errors={[errors.title]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.description}>
          <FieldLabel htmlFor="task-description">Description</FieldLabel>
          <FieldContent>
            <Textarea
              id="task-description"
              rows={3}
              {...register("description")}
            />
            <FieldError errors={[errors.description]} />
          </FieldContent>
        </Field>

        <Field data-invalid={!!errors.dueDate}>
          <FieldLabel htmlFor="task-dueDate">Due Date (optional)</FieldLabel>
          <FieldContent>
            <Input id="task-dueDate" type="date" {...register("dueDate")} />
            <FieldError errors={[errors.dueDate]} />
          </FieldContent>
        </Field>

        {showCompletedField ? (
          <Field>
            <FieldLabel>Completed</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="completed"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                    Mark as complete
                  </label>
                )}
              />
            </FieldContent>
          </Field>
        ) : null}
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
