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
import { CareerStage, CAREER_STAGES } from "@/types/enums";
import { MenteeStatus, MENTEE_STATUSES } from "@/types/domain/mentee";
import {
  menteeFormSchema,
  type CreateMenteeFormValues,
  type MenteeFormValues,
  type UpdateMenteeFormValues,
} from "@/features/mentees/schemas/mentee-form.schema";
import { formatCareerStage, formatMenteeStatus } from "@/utils/labels";

type MenteeFormBaseProps = {
  defaultValues?: Partial<MenteeFormValues>;
  isSubmitting?: boolean;
};

type CreateMenteeFormProps = MenteeFormBaseProps & {
  mode: "create";
  onSubmit: (values: CreateMenteeFormValues) => Promise<void>;
};

type EditMenteeFormProps = MenteeFormBaseProps & {
  mode: "edit";
  onSubmit: (values: UpdateMenteeFormValues) => Promise<void>;
};

type MenteeFormProps = CreateMenteeFormProps | EditMenteeFormProps;

export function MenteeForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: MenteeFormProps) {
  const form = useForm<MenteeFormValues>({
    resolver: zodResolver(menteeFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      currentRole: "",
      targetRole: "",
      careerStage: CareerStage.EXPLORATION,
      yearsOfExperience: 0,
      notes: "",
      status: MenteeStatus.ACTIVE,
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
      onSubmit={handleSubmit((values) => {
        if (mode === "create") {
          return onSubmit(values as CreateMenteeFormValues);
        }

        return onSubmit(values as UpdateMenteeFormValues);
      })}
      className="space-y-6"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.fullName}>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <FieldContent>
            <Input id="fullName" {...register("fullName")} />
            <FieldError errors={[errors.fullName]} />
          </FieldContent>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldContent>
              <Input id="email" type="email" {...register("email")} />
              <FieldError errors={[errors.email]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <FieldContent>
              <Input id="phone" {...register("phone")} />
              <FieldError errors={[errors.phone]} />
            </FieldContent>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!errors.currentRole}>
            <FieldLabel htmlFor="currentRole">Current Role</FieldLabel>
            <FieldContent>
              <Input id="currentRole" {...register("currentRole")} />
              <FieldError errors={[errors.currentRole]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.targetRole}>
            <FieldLabel htmlFor="targetRole">Target Role</FieldLabel>
            <FieldContent>
              <Input id="targetRole" {...register("targetRole")} />
              <FieldError errors={[errors.targetRole]} />
            </FieldContent>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={!!errors.careerStage}>
            <FieldLabel>Career Stage</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="careerStage"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select career stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAREER_STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {formatCareerStage(stage)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.careerStage]} />
            </FieldContent>
          </Field>

          <Field data-invalid={!!errors.yearsOfExperience}>
            <FieldLabel htmlFor="yearsOfExperience">Years of Experience</FieldLabel>
            <FieldContent>
              <Input
                id="yearsOfExperience"
                type="number"
                min={0}
                {...register("yearsOfExperience", { valueAsNumber: true })}
              />
              <FieldError errors={[errors.yearsOfExperience]} />
            </FieldContent>
          </Field>
        </div>

        {mode === "edit" ? (
          <Field data-invalid={!!errors.status}>
            <FieldLabel>Status</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENTEE_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatMenteeStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.status]} />
            </FieldContent>
          </Field>
        ) : null}

        <Field data-invalid={!!errors.notes}>
          <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
          <FieldContent>
            <Textarea id="notes" rows={4} {...register("notes")} />
            <FieldError errors={[errors.notes]} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Mentee"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
