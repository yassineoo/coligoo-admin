import { BellRing } from "lucide-react";
import SwitchLanguages from "./switch-languages";
import Link from "next/link";

export default function TopBar() {
  return (
    <section className=" z-40 bg-white w-full   sticky top-0 flex justify-between items-center p-4">
      {/* search bar */}
      <div></div>
      <div className="flex items-center gap-4 ">
        <SwitchLanguages />
        <Link href="/admin/notifications">
          <BellRing className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
