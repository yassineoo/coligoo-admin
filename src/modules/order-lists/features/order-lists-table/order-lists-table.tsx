"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Pencil } from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox";
import { DataTable } from "../../../../components/ui/data-table";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Order } from "../../order-lists-types";
import { ordersData } from "../../order-lists-data";

export default function OrderListsTable() {
  const t = useTranslations("orderListsTable");

  const columns: ColumnDef<Order>[] = [
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
      accessorKey: "date",
      header: t("date"),
      cell: ({ row }) => (
        <div className="font-medium text-nowrap text-[var(--table-text)]">
          {row.getValue("date")}
        </div>
      ),
    },
    {
      accessorKey: "tracking",
      header: t("tracking"),
      cell: ({ row }) => (
        <div className="inline-flex items-center px-2 py-1 rounded bg-[var(--primary-color)] text-white text-sm font-medium">
          {row.getValue("tracking")}
        </div>
      ),
    },
    {
      accessorKey: "client",
      header: t("client"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">{row.getValue("client")}</div>
      ),
    },
    {
      accessorKey: "contact",
      header: t("contact"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("contact")}
        </div>
      ),
    },
    {
      accessorKey: "wilaya",
      header: t("wilaya"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">{row.getValue("wilaya")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: t("address"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("address")}
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
      accessorKey: "order",
      header: t("order"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">{row.getValue("order")}</div>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: t("totalPrice"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)] font-medium">
          {row.getValue("totalPrice")}
        </div>
      ),
    },
    {
      accessorKey: "delivery",
      header: t("delivery"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("delivery")}
        </div>
      ),
    },
    {
      accessorKey: "procedure",
      header: t("procedure"),
      cell: ({ row }) => (
        <div className="text-[var(--table-text)]">
          {row.getValue("procedure")}
        </div>
      ),
    },
    {
      accessorKey: "condition",
      header: t("condition"),
      cell: ({ row }) => {
        const condition = row.getValue("condition") as
          | "delivered"
          | "pending"
          | "cancelled"
          | "processing";
        return (
          <StatusBadge
            status={condition}
            translationNamespace="orderListsTable"
          />
        );
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
    <div className="space-y-4 ">
      <DataTable columns={columns} data={ordersData} />
    </div>
  );
}
