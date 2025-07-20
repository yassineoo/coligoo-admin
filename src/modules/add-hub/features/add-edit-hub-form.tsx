"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  addEditHubSchema,
  editHubSchema,
  HubData,
  type AddEditHubFormData,
  type EditHubFormData,
} from "../add-edit-hub-schema";
import InputField from "../../../components/ui/input-field";
import PasswordField from "../../../components/ui/password-field";
import { Button } from "../../../components/ui/button";

interface AddEditHubFormProps {
  hubData?: HubData;
}

export default function AddEditHubForm({ hubData }: AddEditHubFormProps) {
  const t = useTranslations("hubForm");
  const isEditing = !!hubData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddEditHubFormData | EditHubFormData>({
    resolver: zodResolver(isEditing ? editHubSchema : addEditHubSchema),
    defaultValues: hubData
      ? {
          firstName: hubData.firstName,
          lastName: hubData.lastName,
          phoneNumber: hubData.phoneNumber,
          emailAddress: hubData.emailAddress,
          fullAddress: hubData.fullAddress,
        }
      : {
          firstName: "",
          lastName: "",
          phoneNumber: "",
          emailAddress: "",
          fullAddress: "",
          password: "",
          confirmPassword: "",
        },
  });

  async function onSubmit(data: AddEditHubFormData | EditHubFormData) {
    console.log("Form submitted with data:", data);
  }

  return (
    <div className="w-full px-8 space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General Information Section */}
        <div className="space-y-4 w-full">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {t("generalInformation")}
          </h2>

          <div className="flex w-full justify-between gap-8">
            <InputField
              label={t("firstName")}
              id="firstName"
              placeholder="Hamza"
              error={errors.firstName?.message}
              {...register("firstName")}
              className="basis-1/2"
            />

            <InputField
              label={t("lastName")}
              id="lastName"
              placeholder="Bouchanane"
              error={errors.lastName?.message}
              {...register("lastName")}
              className="basis-1/2"
            />
          </div>

          <div className="flex justify-between gap-8">
            <InputField
              label={t("phoneNumber")}
              id="phoneNumber"
              type="tel"
              placeholder="0549461543"
              error={errors.phoneNumber?.message}
              {...register("phoneNumber")}
              className="basis-1/2"
            />

            <InputField
              label={t("emailAddress")}
              id="emailAddress"
              type="email"
              placeholder="hamza@email.com"
              error={errors.emailAddress?.message}
              {...register("emailAddress")}
              className="basis-1/2"
            />
          </div>
        </div>

        {/* Full Address Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {t("fullAddress")}
          </h2>

          <div className="w-full">
            <InputField
              label={t("fullAddress")}
              id="fullAddress"
              placeholder="Address"
              error={errors.fullAddress?.message}
              {...register("fullAddress")}
              className="w-full"
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {t("password")}
          </h2>

          <div className="flex justify-between gap-8">
            <PasswordField
              label={t("password")}
              id="password"
              placeholder="*******************"
              error={errors.password?.message}
              {...register("password")}
              className="basis-1/2"
            />

            <PasswordField
              label={t("rewritePassword")}
              id="confirmPassword"
              placeholder="*******************"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
              className="basis-1/2"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-4 pt-6 mb-12">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "..." : isEditing ? t("editHub") : t("addHub")}
          </Button>
        </div>
      </form>
    </div>
  );
}
