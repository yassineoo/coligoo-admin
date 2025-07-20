"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { DataTable } from "../../../../components/ui/data-table";
import { Checkbox } from "../../../../components/ui/checkbox";
import { StatusBadge } from "../../../../components/ui/status-badge";
import { Pen } from "lucide-react";
import { Moderator } from "../../moderators-types";

interface ModeratorsTableProps {
  data: Moderator[];
}

export default function ModeratorsTable({ data }: ModeratorsTableProps) {
  const t = useTranslations("moderatorsSection");

  const columns: ColumnDef<Moderator>[] = [
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

    // ID
    {
      accessorKey: "id",
      header: t("id"),
      cell: ({ row }) => (
        <span className="font-medium text-[var(--text-primary)]">
          {row.getValue("id")}
        </span>
      ),
    },

    // First name
    {
      accessorKey: "firstName",
      header: t("firstName"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)]">
          {row.getValue("firstName")}
        </span>
      ),
    },

    // Last name
    {
      accessorKey: "lastName",
      header: t("lastName"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)]">
          {row.getValue("lastName")}
        </span>
      ),
    },

    // Phone number
    {
      accessorKey: "phoneNumber",
      header: t("phoneNumber"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)]">
          {row.getValue("phoneNumber")}
        </span>
      ),
    },

    // Email address
    {
      accessorKey: "emailAddress",
      header: t("emailAddress"),
      cell: ({ row }) => (
        <span className="text-[var(--text-primary)]">
          {row.getValue("emailAddress")}
        </span>
      ),
    },

    // Permissions
    {
      accessorKey: "permissions",
      header: t("permissions"),
      cell: ({ row }) => {
        const permissions = row.getValue("permissions") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {permissions.map((permission, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-[10px] text-xs font-medium bg-[var(--permission-bg)] text-[var(--permission-text)] border border-[var(--permission-border)]"
              >
                {t(
                  `permissionTypes.${permission
                    .toLowerCase()
                    .replace(/\s+/g, "_")}`
                )}
              </span>
            ))}
          </div>
        );
      },
    },

    // Status
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as "active" | "blocked";
        return (
          <StatusBadge
            status={status === "blocked" ? "inactive" : "active"}
            translationNamespace="moderators"
          />
        );
      },
    },

    // Actions
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          className="p-2 hover:bg-[var(--bg-hover)] rounded-md transition-colors"
          onClick={() => {
            console.log("Edit moderator:", row.original.id);
          }}
        >
          <Pen className="h-4 w-4 text-[var(--text-primary)]" />
        </button>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
