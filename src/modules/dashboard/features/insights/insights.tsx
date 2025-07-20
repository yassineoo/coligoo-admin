import { useTranslations } from "next-intl";
import { Store, Truck, Package, DollarSign } from "lucide-react";
import InsightCard from "./insight-card";

export default function Insights() {
  const t = useTranslations();

  const insightsData = [
    {
      title: t("totalVendors"),
      value: t("sampleData.vendorCount"),
      icon: Store,
      iconBgColor: "bg-purple-bg",
      iconColor: "text-purple-icon",
    },
    {
      title: t("totalDeliveryMen"),
      value: t("sampleData.deliveryMenCount"),
      icon: Truck,
      iconBgColor: "bg-green-bg",
      iconColor: "text-green-icon",
    },
    {
      title: t("totalHubs"),
      value: t("sampleData.hubsCount"),
      icon: Package,
      iconBgColor: "bg-red-bg",
      iconColor: "text-red-icon",
    },
    {
      title: t("totalRevenue"),
      value: t("sampleData.revenueAmount"),
      icon: DollarSign,
      iconBgColor: "bg-gray-bg",
      iconColor: "text-gray-800",
    },
  ];

  return (
    <div className="flex gap-3 w-full">
      {insightsData.map((insight, index) => (
        <InsightCard
          key={index}
          title={insight.title}
          value={insight.value}
          icon={insight.icon}
          iconBgColor={insight.iconBgColor}
          iconColor={insight.iconColor}
        />
      ))}
    </div>
  );
}
