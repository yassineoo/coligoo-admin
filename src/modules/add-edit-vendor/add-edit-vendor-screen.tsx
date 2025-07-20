import { SquareArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AddEditVendorForm from "./features/add-edit-vendor-form";

export default function AddEditVendorScreen() {
  const t = useTranslations();

  return (
    <div className=" space-y-16">
      <div className="flex items-center gap-2 ">
        <Link href={"/admin/vendors"}>
          <SquareArrowLeft className="w-10 h-10  fill-orange-500 stroke-white stroke-1 " />
        </Link>
        <h2>{t("addEditVendor")}</h2>
      </div>
      {/* Add your form or other components here */}
      <AddEditVendorForm />
    </div>
  );
}
