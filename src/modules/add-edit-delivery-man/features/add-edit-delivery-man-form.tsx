"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import InputField from "../../../components/ui/input-field";
import PasswordField from "../../../components/ui/password-field";
import DatePicker from "../../../components/ui/date-picker";
import { Button } from "../../../components/ui/button";
import {
  addEditDeliveryManSchema,
  AddEditDeliveryManFormData,
} from "../add-edit-delivery-man-schema";

export default function AddEditDeliveryManForm() {
  const t = useTranslations("deliveryManForm");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddEditDeliveryManFormData>({
    resolver: zodResolver(addEditDeliveryManSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailAddress: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: AddEditDeliveryManFormData) {
    console.log("Delivery man form data:", data);
    // Handle form submission here
  }

  return (
    <div className="w-full px-8 space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General Information Section */}
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-medium text-text-primary">
            {t("generalInformation")}
          </h3>
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

        {/* Age Section */}
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-medium text-text-primary">{t("age")}</h3>
          <div className="flex justify-between gap-8">
            <DatePicker
              label={t("dateOfBirth")}
              id="dateOfBirth"
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth")}
              className="w-full"
            />
          </div>
        </div>

        {/* Password Section */}
        <div className="space-y-4 w-full">
          <h3 className="text-xl font-medium text-text-primary">
            {t("password")}
          </h3>
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

        {/* Action Buttons */}
        <div className="flex  gap-4 pt-6 mb-12">
          <Button type="submit" className="px-8" disabled={isSubmitting}>
            {t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
