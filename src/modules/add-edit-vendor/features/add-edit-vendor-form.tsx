"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  addEditVendorSchema,
  editVendorSchema,
  VendorData,
  type AddEditVendorFormData,
  type EditVendorFormData,
} from "../add-edit-vendor-schema";
import InputField from "../../../components/ui/input-field";
import PasswordField from "../../../components/ui/password-field";
import { Button } from "../../../components/ui/button";
import Select from "@/components/ui/select";

interface AddEditVendorFormProps {
  vendorData?: VendorData;
}

export default function AddEditVendorForm({
  vendorData,
}: AddEditVendorFormProps) {
  const t = useTranslations("vendorForm");
  const isEditing = !!vendorData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddEditVendorFormData | EditVendorFormData>({
    resolver: zodResolver(isEditing ? editVendorSchema : addEditVendorSchema),
    defaultValues: vendorData
      ? {
          firstName: vendorData.firstName,
          lastName: vendorData.lastName,
          phoneNumber: vendorData.phoneNumber,
          emailAddress: vendorData.emailAddress,
          storeName: vendorData.storeName,
          hub: vendorData.hub,
        }
      : {
          firstName: "",
          lastName: "",
          phoneNumber: "",
          emailAddress: "",
          storeName: "",
          hub: "",
          password: "",
          confirmPassword: "",
        },
  });

  const hubOptions = [
    { value: "algerCentre", label: t("hubOptions.algerCentre") },
    { value: "oranHub", label: t("hubOptions.oranHub") },
    { value: "constantinaHub", label: t("hubOptions.constantinaHub") },
    { value: "annaba", label: t("hubOptions.annaba") },
  ];

  async function onSubmit(data: AddEditVendorFormData | EditVendorFormData) {
    console.log("Form submitted with data:", data);
  }

  return (
    <div className="w-full px-8 space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General Information Section */}
        <div className="space-y-4 w-full">
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

        {/* Store Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {t("store")}
          </h2>

          <div className="flex justify-between gap-7">
            <InputField
              label={t("storeName")}
              id="storeName"
              placeholder="Chic Boutique"
              error={errors.storeName?.message}
              {...register("storeName")}
              className="basis-1/2"
            />

            <Select
              label={t("hub")}
              id="hub"
              placeholder="Select a hub"
              options={hubOptions}
              error={errors.hub?.message}
              {...register("hub")}
              className="basis-1/2"
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
        <div className="flex items-center  gap-4 pt-6 mb-12">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "..."
              : isEditing
              ? t("editVendor")
              : t("addVendor")}
          </Button>
        </div>
      </form>
    </div>
  );
}
