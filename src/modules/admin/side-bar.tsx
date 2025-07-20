"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Truck,
  Package,
  PackageOpen,
  DollarSign,
  Users,
  Code,
  Settings,
  LogOut,
} from "lucide-react";
import logoWithText from "@/assets/logo-with-text.svg";
import Image from "next/image";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";

const navItems = [
  {
    key: "dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    key: "vendors",
    href: "/admin/vendors",
    icon: Store,
  },
  {
    key: "deliveryMen",
    href: "/admin/delivery-men",
    icon: Truck,
  },
  {
    key: "hubs",
    href: "/admin/hubs",
    icon: Package,
  },
  {
    key: "orderLists",
    href: "/admin/orders",
    icon: PackageOpen,
  },
  {
    key: "transactions",
    href: "/admin/transactions",
    icon: DollarSign,
  },
  {
    key: "moderators",
    href: "/admin/moderators",
    icon: Users,
  },
  {
    key: "development",
    href: "/admin/development",
    icon: Code,
  },
  {
    key: "settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function SideBar() {
  const t = useTranslations();
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <div className="w-full  h-screen space-y-8 sticky py-4 px-4 top-0 bg-white flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center ">
        <Image src={logoWithText} alt="coligo logo" />
      </div>

      {/* Navigation Items */}
      <div className=" flex-1 ">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={clsx(
                  "flex gap-2 group px-2 py-3 hover:bg-orange-500 transition-colors relative hover:text-white rounded-[6px] font-semibold",
                  {
                    isActive: isActive, // Highlight active item
                    "text-gray-600": !isActive, // Default text color
                  }
                )}
              >
                <Icon
                  className={clsx("w-6 h-6 group-hover:text-white", {
                    "text-white": isActive,
                    "text-gray-600": !isActive,
                  })}
                />
                <span className="capitalize">{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="  border-gray-200">
        <button className="flex items-center space-x-3 w-full px-2 py-3  font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );
}
