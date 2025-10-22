"use client";

import { Store, Truck, Package, DollarSign, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOnScreen } from "@/../hooks/useIntersectionObserver";

const statCards = [
  {
    title: "Total Vendors",
    value: "23",
    icon: Store,
    bgColor: "bg-[#F7F4FF]",
    iconColor: "#003F80",
  },
  {
    title: "Total Delivery men",
    value: "23",
    icon: Truck,
    bgColor: "bg-[#F4FFF7]",
    iconColor: "#008001",
  },
  {
    title: "Total Hubs",
    value: "23",
    icon: Package,
    bgColor: "bg-[#FFF7F4]",
    iconColor: "#DC4031",
  },
  {
    title: "Total Revenue",
    value: "3 230 096 DA",
    icon: DollarSign,
    bgColor: "bg-[#E6E3E1]",
    iconColor: "#292D32",
  },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const packagesData = [
  { day: "Mon", values: [45, 43, 72] },
  { day: "Tue", values: [55, 14, 125] },
  { day: "Wed", values: [46, 43, 109] },
  { day: "Thu", values: [100, 52, 54] },
  { day: "Fri", values: [77, 15, 54] },
  { day: "Sat", values: [46, 15, 136] },
];

const registrationsData = [
  { day: "Mon", values: [45, 43, 72] },
  { day: "Tue", values: [55, 14, 125] },
  { day: "Wed", values: [46, 43, 109] },
  { day: "Thu", values: [100, 52, 54] },
  { day: "Fri", values: [77, 15, 54] },
  { day: "Sat", values: [46, 15, 136] },
];

function BarChart({ data }: { data: typeof packagesData }) {
  const maxValue = 300;
  const containerRef = useRef<any>(null);
  const inView = useOnScreen(containerRef, { rootMargin: "-40px" });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView) setAnimated(true);
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className="flex items-end justify-between h-64 px-8 pb-12 relative"
    >
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-1 flex-1">
          <div className="flex flex-col items-center gap-0 w-full max-w-[28px] mx-auto">
            {item.values.map((value, i) => {
              const height = (value / maxValue) * 200;
              const delayMs = (index * 3 + i) * 60;
              return (
                <div
                  key={i}
                  className="w-full bg-[#FF5A01] transition-all duration-700 ease-out"
                  style={{
                    height: animated ? `${height}px` : "0px",
                    borderRadius: i === 0 ? "6px 6px 0 0" : "0",
                    transitionDelay: `${delayMs}ms`,
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div className="absolute left-0 right-0 bottom-0 h-px bg-[#292D32]/20" />
    </div>
  );
}

function ChartWithStats({
  title,
  data,
  stats,
}: {
  title: string;
  data: typeof packagesData;
  stats: { label: string; value: string; subValue?: string }[];
}) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-end gap-3 w-full">
      <div className="flex flex-col gap-3 flex-1 w-full">
        <h2 className="text-2xl font-semibold text-[#292D32] font-roboto">
          {title}
        </h2>
        <div className="bg-white rounded-lg shadow-sm p-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-[#292D32] font-roboto">
              This week
            </h3>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-6 h-6 text-[#292D32]" />
            </button>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col justify-between items-end text-right text-[#292D32]/40 text-sm pt-6 pb-12">
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>

            <div className="flex-1 relative">
              <div className="absolute inset-0 flex flex-col justify-between pt-6 pb-12">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-px bg-[#292D32]/5" />
                ))}
                <div className="h-px bg-[#292D32]/20" />
              </div>

              <BarChart data={data} />

              <div className="flex justify-around pt-4">
                {weekDays.map((day) => (
                  <span
                    key={day}
                    className="text-[#292D32]/40 text-sm font-roboto flex-1 text-center"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full lg:w-52">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <p className="text-[#7D7D7D] text-sm font-semibold font-roboto">
                {stat.label}
              </p>
              <div className="flex flex-col">
                <p className="text-[#FF5A01] text-2xl font-semibold font-roboto">
                  {stat.value}
                </p>
                {stat.subValue && (
                  <p className="text-[#FF5A01] text-sm font-roboto">
                    {stat.subValue}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg px-[11px] py-[21px] flex items-center gap-6 [@media(min-width:1440px)]:px-[23px] [@media(min-width:1440px)]:py-[42px]"
            >
              <div
                className={`${card.bgColor} rounded-full p-2.5 flex items-center justify-center min-w-[42px] min-h-[42px]`}
              >
                <Icon
                  className="w-6 h-6"
                  style={{ color: card.iconColor }}
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-[#292D32] text-base font-roboto text-center">
                  {card.title}
                </p>
                <p className="text-[#292D32] text-lg font-bold font-inter text-center">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ChartWithStats
        title="Packages processed"
        data={packagesData}
        stats={[
          { label: "N° of packages", value: "556254" },
          { label: "Top month", value: "November", subValue: "2024" },
          { label: "Top year", value: "2025", subValue: "89k Total order" },
        ]}
      />

      <ChartWithStats
        title="New registrations"
        data={registrationsData}
        stats={[
          { label: "Top month", value: "November", subValue: "2024" },
          {
            label: "Top year",
            value: "2025",
            subValue: "89k Total registrations",
          },
        ]}
      />
    </div>
  );
}
