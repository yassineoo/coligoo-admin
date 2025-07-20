import { useTranslations } from "next-intl";
import { HubsTable } from "./features/hubs-table/hubs-table";
import HubsActions from "./features/hubs-actions/hubs-actions";

export default function HubsScreen() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {t("hubs")}
        </h2>
        <HubsActions />
      </div>

      {/* Hubs Table */}
      <HubsTable />
    </div>
  );
}
