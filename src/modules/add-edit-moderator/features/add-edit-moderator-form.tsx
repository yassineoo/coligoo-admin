"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  addEditModeratorSchema,
  editModeratorSchema,
  ModeratorData,
  type AddEditModeratorFormData,
  type EditModeratorFormData,
} from "../add-edit-moderator-schema";
import InputField from "../../../components/ui/input-field";
import PasswordField from "../../../components/ui/password-field";
import MultiSelectField from "../../../components/ui/multi-select-field";
import { Button } from "../../../components/ui/button";

interface AddEditModeratorFormProps {
  moderatorData?: ModeratorData;
}

export default function AddEditModeratorForm({
  moderatorData,
}: AddEditModeratorFormProps) {
  const t = useTranslations("moderatorForm");
  const isEditing = !!moderatorData;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddEditModeratorFormData | EditModeratorFormData>({
    resolver: zodResolver(
      isEditing ? editModeratorSchema : addEditModeratorSchema
    ),
    defaultValues: moderatorData
      ? {
          firstName: moderatorData.firstName,
          lastName: moderatorData.lastName,
          phoneNumber: moderatorData.phoneNumber,
          emailAddress: moderatorData.emailAddress,
          permissions: moderatorData.permissions,
        }
      : {
          firstName: "",
          lastName: "",
          phoneNumber: "",
          emailAddress: "",
          permissions: [],
          password: "",
          confirmPassword: "",
        },
  });

  const permissionOptions = [
    { value: "manage_vendors", label: t("permissionOptions.manageVendors") },
    { value: "manage_orders", label: t("permissionOptions.manageOrders") },
    {
      value: "manage_delivery_men",
      label: t("permissionOptions.manageDeliveryMen"),
    },
    {
      value: "manage_transactions",
      label: t("permissionOptions.manageTransactions"),
    },
    { value: "view_analytics", label: t("permissionOptions.viewAnalytics") },
    { value: "manage_hubs", label: t("permissionOptions.manageHubs") },
  ];

  async function onSubmit(
    data: AddEditModeratorFormData | EditModeratorFormData
  ) {
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

        {/* Permissions Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {t("permissions")}
          </h2>

          <div className="w-full">
            <MultiSelectField
              label={t("choosePermissions")}
              id="permissions"
              name="permissions"
              placeholder={t("permissionsPlaceholder")}
              options={permissionOptions}
              error={errors.permissions?.message}
              onChange={(value) => setValue("permissions", value)}
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
              placeholder="*******"
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
            {isSubmitting
              ? "..."
              : isEditing
              ? t("editModerator")
              : t("addModerator")}
          </Button>
        </div>
      </form>
    </div>
  );
}
