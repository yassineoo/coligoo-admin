"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeliveryMan } from "../../delivery-men-types";
import { deliveryMenData } from "../../delivery-men-data";
import { Pen } from "lucide-react";

export function DeliveryMenTable() {
  const t = useTranslations("deliveryMenTable");

  const columns: ColumnDef<DeliveryMan>[] = [
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
    {
      accessorKey: "id",
      header: t("id"),
      cell: ({ row }) => (
        <div className="text-xs font-normal text-text-primary">
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "firstName",
      header: t("firstName"),
      cell: ({ row }) => (
        <div className="text-xs font-normal text-text-primary">
          {row.getValue("firstName")}
        </div>
      ),
    },
    {
      accessorKey: "lastName",
      header: t("lastName"),
      cell: ({ row }) => (
        <div className="text-xs font-normal text-text-primary">
          {row.getValue("lastName")}
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: t("phoneNumber"),
      cell: ({ row }) => (
        <div className="text-xs font-normal text-text-primary">
          {row.getValue("phoneNumber")}
        </div>
      ),
    },
    {
      accessorKey: "emailAddress",
      header: t("emailAddress"),
      cell: ({ row }) => (
        <div className="text-xs font-normal text-text-primary">
          {row.getValue("emailAddress")}
        </div>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: t("dateOfBirth"),
      cell: ({ row }) => (
        <div className="text-xs font-normal text-text-primary">
          {row.getValue("dateOfBirth")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as "active" | "inactive";

        return (
          <StatusBadge
            status={status}
            translationNamespace="deliveryMenTable"
          />
        );
      },
    },
    {
      id: "actions",
      header: t("actions"),
      cell: () => (
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          <Pen className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-table-border">
      <DataTable columns={columns} data={deliveryMenData} />
    </div>
  );
}
