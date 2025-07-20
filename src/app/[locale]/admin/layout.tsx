import SideBar from "@/modules/admin/side-bar";
import TopBar from "@/modules/admin/top-bar";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex  rtl:flex-row-reverse     ">
      <div className="rtl:order-2 w-[20%]">
        <SideBar />
      </div>
      <main className="rtl:order-1  w-[80%]   bg-gray-100 ">
        <TopBar />
        <div className="p-4 w-full  ">{children}</div>
      </main>
    </div>
  );
}
