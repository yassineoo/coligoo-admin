"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "../../../../components/ui/button";
import { Plus, Trash2, UserCheck, UserX } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function HubsActions() {
  const t = useTranslations("hubsActions");

  function onDelete() {
    console.log("Delete hubs");
  }

  function onDeactivate() {
    console.log("Deactivate hubs");
  }

  function onActivate() {
    console.log("Activate hubs");
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Delete Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="text-[var(--text-primary)]"
      >
        <Trash2 className="h-4 w-4" />
        {t("delete")}
      </Button>

      {/* Deactivate Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onDeactivate}
        className="text-[var(--text-primary)]"
      >
        <UserX className="h-4 w-4" />
        {t("deactivate")}
      </Button>

      {/* Activate Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onActivate}
        className="text-[var(--text-primary)]"
      >
        <UserCheck className="h-4 w-4" />
        {t("activate")}
      </Button>

      {/* Add Hub Button */}
      <Button type="button" className="flex" variant="default" size="sm">
        <Link className="flex" href="/admin/hubs/add-edit-hub">
          <Plus className="h-4 w-4" />
          {t("addHub")}
        </Link>
      </Button>
    </div>
  );
}
