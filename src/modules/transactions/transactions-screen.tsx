"use client";

import { useTranslations } from "next-intl";
import { transactionsData } from "./transactions-data";
import TransactionsActions from "./features/transactions-actions/transactions-actions";
import TransactionsTable from "./features/transactions-table/transactions-table";

export default function TransactionsScreen() {
  const t = useTranslations("transactionsSection");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {t("title")}
        </h2>
        <TransactionsActions />
      </div>

      <TransactionsTable data={transactionsData} />
    </div>
  );
}
