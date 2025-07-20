"use client";

import { useTranslations } from "next-intl";
import { Trash2, Ban, RotateCcw, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Link } from "@/i18n/navigation";

export default function ModeratorsActions() {
  const t = useTranslations("moderatorsSection");

  function onDelete() {
    console.log("Delete moderators");
  }

  function onDeactivate() {
    console.log("Deactivate moderators");
  }

  function onActivate() {
    console.log("Activate moderators");
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="text-[var(--text-primary)]"
      >
        <Trash2 className="h-4 w-4" />
        {t("delete")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onDeactivate}
        className="text-[var(--text-primary)]"
      >
        <Ban className="h-4 w-4" />
        {t("deactivate")}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onActivate}
        className="text-[var(--text-primary)]"
      >
        <RotateCcw className="h-4 w-4" />
        {t("activate")}
      </Button>

      <Button type="button" className="flex " variant="default" size="sm">
        <Link className="flex" href="/admin/moderators/add-moderator">
          <Plus className="h-4 w-4" />
          {t("addModerator")}
        </Link>
      </Button>
    </div>
  );
}
