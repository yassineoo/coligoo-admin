"use client";

import { useTranslations } from "next-intl";
import { moderatorsData } from "./moderators-data";
import ModeratorsActions from "./features/moderators-actions/moderators-actions";
import ModeratorsTable from "./features/moderators-table/moderators-table";

export default function ModeratorsScreen() {
  const t = useTranslations("moderatorsSection");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {t("title")}
        </h2>
        <ModeratorsActions />
      </div>

      <ModeratorsTable data={moderatorsData} />
    </div>
  );
}
