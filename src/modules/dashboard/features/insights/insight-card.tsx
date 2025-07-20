import { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export default function InsightCard({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
}: InsightCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 flex-1">
      <div className="flex items-center gap-6">
        {/* Icon Section */}
        <div className="relative">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBgColor}`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-gray-800 font-medium text-base text-center">
            {title}
          </h3>
          <p className="text-gray-800 font-semibold text-lg">{value}</p>
        </div>
      </div>
    </div>
  );
}
