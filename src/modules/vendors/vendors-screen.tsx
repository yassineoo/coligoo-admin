import { useTranslations } from "next-intl";
import VendorsTable from "./features/vendors-table/vendors-table";
import VendorsActions from "./features/vendors-actions/vendors-actions";

export default function VendorsScreen() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className=" flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {t("vendors")}
        </h2>
        <VendorsActions />
      </div>

      {/* Vendors Actions */}

      {/* Vendors Table */}
      <VendorsTable />
    </div>
  );
}
