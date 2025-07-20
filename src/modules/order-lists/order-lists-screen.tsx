import { useTranslations } from "next-intl";
import OrderListsTable from "./features/order-lists-table/order-lists-table";
import OrderListsActions from "./features/order-lists-actions/order-lists-actions";

export default function OrderListsScreen() {
  const t = useTranslations();

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {t("orderLists")}
        </h2>
        <OrderListsActions />
      </div>

      {/* Order Lists Table */}
      <OrderListsTable />
    </div>
  );
}
