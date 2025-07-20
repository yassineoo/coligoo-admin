"use client";

import { useTranslations } from "next-intl";
import { Trash2, Ban, RotateCcw, Filter, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Link } from "@/i18n/navigation";

export default function VendorsActions() {
  const t = useTranslations("vendorActions");
  function onDelete() {
    console.log("Delete vendors");
  }
  function onDeactivate() {
    console.log("Deactivate vendors");
  }
  function onActivate() {
    console.log("Activate vendors");
  }
  function onFilter() {
    console.log("Filter vendors");
  }
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
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
        <Ban className="h-4 w-4" />
        {t("deactivate")}
      </Button>

      {/* Activate Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onActivate}
        className="text-[var(--text-primary)]"
      >
        <RotateCcw className="h-4 w-4" />
        {t("activate")}
      </Button>

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

      {/* Add Vendor Button */}
      <Button type="button" className="flex " variant="default" size="sm">
        <Link className="flex" href="/admin/vendors/add-vendor">
          <Plus className="h-4 w-4" />
          {t("addVendor")}
        </Link>
      </Button>
    </div>
  );
}
