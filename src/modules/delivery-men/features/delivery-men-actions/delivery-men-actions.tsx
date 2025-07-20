"use client";

import { useTranslations } from "next-intl";
import { Trash2, Ban, RotateCcw, Filter, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Link } from "@/i18n/navigation";

export default function DeliveryMenActions() {
  const t = useTranslations("deliveryMenActions");

  function onDelete() {
    console.log("Delete delivery men");
  }

  function onDeactivate() {
    console.log("Deactivate delivery men");
  }

  function onActivate() {
    console.log("Activate delivery men");
  }

  function onFilter() {
    console.log("Filter delivery men");
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

      {/* Add Delivery Man Button */}
      <Button type="button" className="flex" variant="default" size="sm">
        <Link className="flex" href="/admin/delivery-men/add-delivery-man">
          <Plus className="h-4 w-4" />
          {t("addDeliveryMan")}
        </Link>
      </Button>
    </div>
  );
}
