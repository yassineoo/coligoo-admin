"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox";
import { DataTable } from "../../../../components/ui/data-table";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Vendor } from "../../vendors-types";
import { vendorsData } from "../../vendors-data";

// Mock data for demonstration

export default function VendorsTable() {
  const t = useTranslations("vendorsTable");

  const columns: ColumnDef<Vendor>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) =>
            table.toggleAllPageRowsSelected(value)
          }
          aria-label={t("selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(value)}
          aria-label={t("selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("id"),
      cell: ({ row }) => (
        <div className="font-medium text-[var(--table-text)]">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "firstName",
      header: t("firstName"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("firstName")}
        </div>
      ),
    },
    {
      accessorKey: "lastName",
      header: t("lastName"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("lastName")}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: t("phoneNumber"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("phoneNumber")}
        </div>
      ),
    },
    {
      accessorKey: "emailAddress",
      header: t("emailAddress"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("emailAddress")}
        </div>
      ),
    },
    {
      accessorKey: "storeName",
      header: t("storeName"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("storeName")}
        </div>
      ),
    },
    {
      accessorKey: "hub",
      header: t("hub"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">{row.getValue("hub")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as
          | "active"
          | "inactive"
          | "pending";
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: t("actions"),
      cell: () => {
        return (
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-[var(--table-text)] hover:bg-[var(--table-row-hover)] transition-colors"
              aria-label={t("edit")}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center rounded-md p-2 text-[var(--table-text)] hover:bg-[var(--table-row-hover)] transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={vendorsData} />
    </div>
  );
}
