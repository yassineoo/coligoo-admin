import { useTranslations } from "next-intl";
import { DeliveryMenTable } from "./features/delivery-men-table/delivery-men-table";
import DeliveryMenActions from "./features/delivery-men-actions/delivery-men-actions";

export default function DeliveryMenScreen() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {t("deliveryMen")}
        </h2>
        {/* Delivery Men Actions */}
        <DeliveryMenActions />
      </div>

      {/* Delivery Men Table */}
      <DeliveryMenTable />
    </div>
  );
}
