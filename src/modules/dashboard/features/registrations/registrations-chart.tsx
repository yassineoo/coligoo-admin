"use client";

import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MoreVertical } from "lucide-react";

const chartData = [
  { day: "Mon", value: 180 },
  { day: "Tue", value: 250 },
  { day: "Wed", value: 190 },
  { day: "Thu", value: 140 },
  { day: "Fri", value: 110 },
  { day: "Sat", value: 270 },
];

export default function RegistrationsChart() {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-semibold text-gray-800">
            {t("registrations.thisWeek")}
          </span>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Chart Container */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#666" }}
              className="text-gray-600"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#666" }}
              domain={[0, 300]}
              ticks={[0, 100, 200, 300]}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 90, 1, 0.1)" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-orange-500">
                        {`Registrations: ${payload[0].value}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              fill="#FF5A01"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
