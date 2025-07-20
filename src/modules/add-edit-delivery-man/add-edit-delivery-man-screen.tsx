import { SquareArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AddEditDeliveryManForm from "./features/add-edit-delivery-man-form";

export default function AddEditDeliveryManScreen() {
  const t = useTranslations();

  return (
    <div className="space-y-16">
      <div className="flex items-center gap-2">
        <Link href={"/admin/delivery-men"}>
          <SquareArrowLeft className="w-10 h-10 fill-orange-500 stroke-white stroke-1" />
        </Link>
        <h2>{t("addEditDeliveryMan")}</h2>
      </div>
      {/* Add your form or other components here */}
      <AddEditDeliveryManForm />
    </div>
  );
}
