"use client";

import { useTranslations } from "next-intl";
import { Filter, Download } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function TransactionsActions() {
  const t = useTranslations("transactionsSection");

  function onFilter() {
    console.log("Filter transactions");
  }

  function onExport() {
    console.log("Export transactions");
  }

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {/* Filters Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onFilter}
        className="text-[var(--text-primary)]"
      >
        <Filter className="h-4 w-4" />
        {t("filters")}
      </Button>

      {/* Export Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="text-[var(--text-primary)]"
      >
        <Download className="h-4 w-4" />
        {t("export")}
      </Button>
    </div>
  );
}
