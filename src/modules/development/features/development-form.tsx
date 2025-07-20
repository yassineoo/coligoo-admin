"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  developmentSchema,
  type DevelopmentFormData,
} from "../development-schema";
import InputField from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";

export function DevelopmentForm() {
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DevelopmentFormData>({
    resolver: zodResolver(developmentSchema),
    defaultValues: {
      secretApiKeys: {
        liveEnvironment: "LIVE-667-777-7788",
        testEnvironment: "LIVE-667-777-7788",
      },
      publishableApiKeys: {
        liveEnvironment: "LIVE-667-777-7788",
        testEnvironment: "LIVE-667-777-7788",
      },
    },
  });

  const onSubmit = async (data: DevelopmentFormData) => {
    try {
      console.log("Development form data:", data);
      // Handle form submission here
    } catch (error) {
      console.error("Error submitting development form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Secret API Keys Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-gray-900">
          {t("developmentSection.secretApiKeys")}
        </h2>
        <div className="flex justify-between gap-4">
          <InputField
            label={t("developmentSection.liveEnvironment")}
            id="secretApiKeys.liveEnvironment"
            {...register("secretApiKeys.liveEnvironment")}
            error={errors.secretApiKeys?.liveEnvironment?.message}
            className="basis-1/2"
          />
          <InputField
            label={t("developmentSection.testEnvironment")}
            id="secretApiKeys.testEnvironment"
            {...register("secretApiKeys.testEnvironment")}
            error={errors.secretApiKeys?.testEnvironment?.message}
            className="basis-1/2"
          />
        </div>
      </div>

      {/* Publishable API Keys Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-medium text-gray-900">
          {t("developmentSection.publishableApiKeys")}
        </h2>
        <div className="flex justify-between gap-4">
          <InputField
            label={t("developmentSection.liveEnvironment")}
            id="publishableApiKeys.liveEnvironment"
            {...register("publishableApiKeys.liveEnvironment")}
            error={errors.publishableApiKeys?.liveEnvironment?.message}
            className="basis-1/2"
          />
          <InputField
            label={t("developmentSection.testEnvironment")}
            id="publishableApiKeys.testEnvironment"
            {...register("publishableApiKeys.testEnvironment")}
            error={errors.publishableApiKeys?.testEnvironment?.message}
            className="basis-1/2"
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("common.saving") : t("common.save")}
      </Button>
    </form>
  );
}
