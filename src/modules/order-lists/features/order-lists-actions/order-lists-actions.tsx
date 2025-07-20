"use client";

import { useTranslations } from "next-intl";
import { Trash2, Edit, Filter, Download, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Link } from "@/i18n/navigation";

export default function OrderListsActions() {
  const t = useTranslations("orderListsActions");

  function onDelete() {
    console.log("Delete orders");
  }

  function onEdit() {
    console.log("Edit order");
  }

  function onFilter() {
    console.log("Filter orders");
  }

  function onExport() {
    console.log("Export orders");
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

      {/* Edit Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="text-[var(--text-primary)]"
      >
        <Edit className="h-4 w-4" />
        {t("edit")}
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

      {/* Export Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="text-[var(--text-primary)]"
      >
        <Download className="h-4 w-4" />
        {t("export")}
      </Button>

      {/* Add Order Button */}
      <Button type="button" className="flex " variant="default" size="sm">
        <Link className="flex" href="/admin/orders/add-order">
          <Plus className="h-4 w-4" />
          {t("addOrder")}
        </Link>
      </Button>
    </div>
  );
}
