"use client";

import { useTranslations } from "next-intl";
import { Button } from "../../components/ui/button";

export function TransactionsActions() {
  const t = useTranslations("transactionsSection");

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        className="text-sm font-medium text-[var(--text-primary)] bg-white border border-[var(--border-primary)] hover:bg-[var(--bg-hover)]"
      >
        {t("filters")}
      </Button>

      <Button
        variant="outline"
        className="text-sm font-medium text-[var(--text-primary)] bg-white border border-[var(--border-primary)] hover:bg-[var(--bg-hover)]"
      >
        {t("export")}
      </Button>
    </div>
  );
}
