"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  addEditOrderSchema,
  OrderData,
  type AddEditOrderFormData,
} from "../add-edit-order-schema";
import InputField from "../../../components/ui/input-field";
import { Button } from "../../../components/ui/button";
import Select from "../../../components/ui/select";

interface AddEditOrderFormProps {
  orderData?: OrderData;
}

export default function AddEditOrderForm({ orderData }: AddEditOrderFormProps) {
  const t = useTranslations("orderForm");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddEditOrderFormData>({
    resolver: zodResolver(addEditOrderSchema),
    defaultValues: orderData
      ? {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          phoneNumber01: orderData.phoneNumber01,
          phoneNumber02: orderData.phoneNumber02,
          commune: orderData.commune,
          wilaya: orderData.wilaya,
          fullAddress: orderData.fullAddress,
          product: orderData.product,
          note: orderData.note,
          orderType: orderData.orderType,
          returnFees: orderData.returnFees,
          deliveryCosts: orderData.deliveryCosts,
          subtotal: orderData.subtotal,
          totalToCollect: orderData.totalToCollect,
        }
      : {
          firstName: "",
          lastName: "",
          phoneNumber01: "",
          phoneNumber02: "",
          commune: "",
          wilaya: "",
          fullAddress: "",
          product: "",
          note: "",
          orderType: "stopdesk",
          returnFees: 0,
          deliveryCosts: 0,
          subtotal: 0,
          totalToCollect: 0,
        },
  });

  const watchOrderType = watch("orderType");

  // Wilaya options (sample Algerian wilayas)
  const wilayaOptions = [
    { value: "alger", label: "Alger" },
    { value: "oran", label: "Oran" },
    { value: "constantine", label: "Constantine" },
    { value: "annaba", label: "Annaba" },
    { value: "blida", label: "Blida" },
    { value: "setif", label: "Sétif" },
    { value: "sidi-bel-abbes", label: "Sidi Bel Abbès" },
    { value: "biskra", label: "Biskra" },
  ];

  // Commune options (sample communes)
  const communeOptions = [
    { value: "bordj-el-kiffan", label: "Bordj El Kiffan" },
    { value: "hussein-dey", label: "Hussein Dey" },
    { value: "bir-mourad-rais", label: "Bir Mourad Raïs" },
    { value: "el-biar", label: "El Biar" },
    { value: "hydra", label: "Hydra" },
    { value: "kouba", label: "Kouba" },
    { value: "dar-el-beida", label: "Dar El Beïda" },
    { value: "cheraga", label: "Chéraga" },
  ];

  async function onSubmit(data: AddEditOrderFormData) {
    console.log("Order form submitted with data:", data);
  }

  const handleCancel = () => {
    console.log("Order form cancelled");
  };

  return (
    <div className="w-full px-8 space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Customer Information Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {t("customerInformation")}
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <InputField
              label={t("firstName")}
              id="firstName"
              placeholder="Hamza"
              error={errors.firstName?.message}
              {...register("firstName")}
            />

            <InputField
              label={t("lastName")}
              id="lastName"
              placeholder="Bouchanane"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <InputField
              label={t("phoneNumber01")}
              id="phoneNumber01"
              type="tel"
              placeholder="0549461543"
              error={errors.phoneNumber01?.message}
              {...register("phoneNumber01")}
            />

            <InputField
              label={t("phoneNumber02")}
              id="phoneNumber02"
              type="tel"
              placeholder="0549461543"
              error={errors.phoneNumber02?.message}
              {...register("phoneNumber02")}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Select
              label={t("wilaya")}
              id="wilaya"
              placeholder={t("selectWilaya")}
              options={wilayaOptions}
              error={errors.wilaya?.message}
              {...register("wilaya")}
            />

            <Select
              label={t("commune")}
              id="commune"
              placeholder={t("selectCommune")}
              options={communeOptions}
              error={errors.commune?.message}
              {...register("commune")}
            />
          </div>

          <InputField
            label={t("fullAddress")}
            id="fullAddress"
            placeholder="Palm Street, Bordj El Kiffan District, Algiers 16120, Algeria"
            error={errors.fullAddress?.message}
            {...register("fullAddress")}
          />
        </div>

        {/* Order Information Section */}
        <div className="space-y-6">
          <InputField
            label={t("product")}
            id="product"
            placeholder="watch X5"
            error={errors.product?.message}
            {...register("product")}
          />

          <InputField
            label={t("note")}
            id="note"
            placeholder={t("notePlaceholder")}
            error={errors.note?.message}
            {...register("note")}
          />

          {/* Order Type Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
              {t("orderType")}
            </label>
            <div className="flex gap-4">
              <div
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  watchOrderType === "stopdesk"
                    ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                    : "bg-white text-[var(--text-secondary)] border-[var(--border-color)]"
                }`}
                onClick={() => setValue("orderType", "stopdesk")}
              >
                <span className="text-sm font-medium mr-3">stopdesk</span>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    watchOrderType === "stopdesk"
                      ? "bg-white text-[var(--primary-color)]"
                      : "bg-[var(--primary-color)] text-white"
                  }`}
                >
                  {t("domicile")}
                </span>
              </div>

              <div
                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  watchOrderType === "exchange"
                    ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                    : "bg-white text-[var(--text-secondary)] border-[var(--border-color)]"
                }`}
                onClick={() => setValue("orderType", "exchange")}
              >
                <span className="text-sm font-medium mr-3">Exchange</span>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    watchOrderType === "exchange"
                      ? "bg-white text-[var(--primary-color)]"
                      : "bg-[var(--primary-color)] text-white"
                  }`}
                >
                  {t("normal")}
                </span>
              </div>
            </div>
            {errors.orderType && (
              <p className="text-sm text-red-500">{errors.orderType.message}</p>
            )}
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-4 gap-4">
            <InputField
              label={t("returnFees")}
              id="returnFees"
              type="number"
              placeholder="150 Da"
              error={errors.returnFees?.message}
              {...register("returnFees", { valueAsNumber: true })}
            />

            <InputField
              label={t("deliveryCosts")}
              id="deliveryCosts"
              type="number"
              placeholder="800 Da"
              error={errors.deliveryCosts?.message}
              {...register("deliveryCosts", { valueAsNumber: true })}
            />

            <InputField
              label={t("subtotal")}
              id="subtotal"
              type="number"
              placeholder="7400 Da"
              error={errors.subtotal?.message}
              {...register("subtotal", { valueAsNumber: true })}
            />

            <InputField
              label={t("totalToCollect")}
              id="totalToCollect"
              type="number"
              placeholder="8200 Da"
              error={errors.totalToCollect?.message}
              {...register("totalToCollect", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Validation Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-medium text-[var(--text-primary)]">
            {t("validation")}
          </h2>

          <div className="flex gap-4 justify-center mb-12">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="bg-[var(--background-tertiary)] text-[var(--text-primary)] border-none px-8"
            >
              {t("cancel")}
            </Button>

            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]/90 px-8"
            >
              {isSubmitting ? t("validating") : t("validate")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
