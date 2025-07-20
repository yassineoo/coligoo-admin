"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { DataTable } from "../../../../components/ui/data-table";
import { Checkbox } from "../../../../components/ui/checkbox";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Transaction } from "../../transactions-types";

interface TransactionsTableProps {
  data: Transaction[];
}

export default function TransactionsTable({ data }: TransactionsTableProps) {
  const t = useTranslations("transactionsSection");

  const columns: ColumnDef<Transaction>[] = [
    // Checkbox column
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Transaction ID
    {
      accessorKey: "id",
      header: t("id"),
      cell: ({ row }) => (
        <span className="font-medium text-[var(--text-primary)]">
          {row.getValue("id")}
        </span>
      ),
    },

    // Date
    {
      accessorKey: "date",
      header: t("date"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)] text-nowrap">
          {row.getValue("date")}
        </span>
      ),
    },

    // Hour
    {
      accessorKey: "hour",
      header: t("hour"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)]">
          {row.getValue("hour")}
        </span>
      ),
    },

    // Transaction Type
    {
      accessorKey: "transactionType",
      header: t("type"),
      cell: ({ row }) => {
        const type = row.getValue("transactionType") as string;
        return <span className="text-[var(--text-primary)]">{type}</span>;
      },
    },

    // Amount
    {
      accessorKey: "amount",
      header: t("amount"),
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return (
          <span className="font-medium text-[var(--text-primary)]">
            {amount.toLocaleString()} DA
          </span>
        );
      },
    },

    // Initiator
    {
      accessorKey: "initiator",
      header: t("initiator"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)]">
          {row.getValue("initiator")}
        </span>
      ),
    },

    // Beneficiary
    {
      accessorKey: "beneficiary",
      header: t("beneficiary"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)]">
          {row.getValue("beneficiary")}
        </span>
      ),
    },

    // Description
    {
      accessorKey: "description",
      header: t("transactionDescription"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)]">
          {row.getValue("description")}
        </span>
      ),
    },

    // Status
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as
          | "successful"
          | "failure"
          | "in-progress";
        return (
          <StatusBadge status={status} translationNamespace="transactions" />
        );
      },
    },
  ];

  return (
    <div className="space-y-4 overflow-x-scroll   ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
