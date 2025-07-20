"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import {
  personalInfoSchema,
  passwordChangeSchema,
  type PersonalInfoFormData,
  type PasswordChangeFormData,
} from "../settings-schema";
import InputField from "@/components/ui/input-field";
import PasswordField from "@/components/ui/password-field";
import { Button } from "@/components/ui/button";

export function SettingsForm() {
  const t = useTranslations();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Personal Info Form
  const {
    register: registerPersonalInfo,
    handleSubmit: handlePersonalInfoSubmit,
    formState: {
      errors: personalInfoErrors,
      isSubmitting: isPersonalInfoSubmitting,
    },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "Hamza",
      lastName: "Hamza",
      phoneNumber: "Hamza",
      emailAddress: "Hamza",
    },
  });

  // Password Change Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onPersonalInfoSubmit = async (data: PersonalInfoFormData) => {
    try {
      console.log("Personal info data:", data);
      // Handle personal info submission here
    } catch (error) {
      console.error("Error submitting personal info:", error);
    }
  };

  const onPasswordSubmit = async (data: PasswordChangeFormData) => {
    try {
      console.log("Password change data:", data);
      // Handle password change submission here
      resetPasswordForm();
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl p-12 space-y-8">
      {/* Profile Image Section */}
      <div className="flex items-center gap-12">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="sr-only"
            />
            <div className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:bg-gray-50 shadow-sm">
              <span className="text-gray-900 text-sm font-medium text-center block">
                {t("settingsSection.uploadNewPhoto")}
              </span>
            </div>
          </label>
          <p className="text-gray-600 text-xs leading-relaxed">
            {t("settingsSection.photoRequirements")}
          </p>
        </div>
      </div>

      {/* Personal Information Section */}
      <form
        onSubmit={handlePersonalInfoSubmit(onPersonalInfoSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <InputField
            label={t("settingsSection.firstName")}
            id="firstName"
            {...registerPersonalInfo("firstName")}
            error={personalInfoErrors.firstName?.message}
          />
          <InputField
            label={t("settingsSection.lastName")}
            id="lastName"
            {...registerPersonalInfo("lastName")}
            error={personalInfoErrors.lastName?.message}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <InputField
            label={t("settingsSection.phoneNumber")}
            id="phoneNumber"
            {...registerPersonalInfo("phoneNumber")}
            error={personalInfoErrors.phoneNumber?.message}
          />
          <InputField
            label={t("settingsSection.emailAddress")}
            id="emailAddress"
            type="email"
            {...registerPersonalInfo("emailAddress")}
            error={personalInfoErrors.emailAddress?.message}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPersonalInfoSubmitting}>
            {isPersonalInfoSubmitting
              ? t("common.saving")
              : t("settingsSection.saveChanges")}
          </Button>
        </div>
      </form>

      {/* Password Change Section */}
      <form
        onSubmit={handlePasswordSubmit(onPasswordSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          <PasswordField
            label={t("settingsSection.oldPassword")}
            id="oldPassword"
            {...registerPassword("oldPassword")}
            error={passwordErrors.oldPassword?.message}
          />
          <PasswordField
            label={t("settingsSection.newPassword")}
            id="newPassword"
            {...registerPassword("newPassword")}
            error={passwordErrors.newPassword?.message}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPasswordSubmitting}>
            {isPasswordSubmitting
              ? t("common.saving")
              : t("settingsSection.changePassword")}
          </Button>
        </div>
      </form>
    </div>
  );
}
