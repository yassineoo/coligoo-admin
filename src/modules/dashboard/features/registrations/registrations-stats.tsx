import { useTranslations } from "next-intl";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-500 tracking-tight">
          {title}
        </h3>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-orange-500">{value}</p>
          {subtitle && (
            <p className="text-base font-medium text-orange-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegistrationsStats() {
  const t = useTranslations();

  const statsData = [
    {
      title: t("registrations.topMonth"),
      value: t("november"),
      subtitle: t("sampleData.year2024"),
    },
    {
      title: t("registrations.topYear"),
      value: t("sampleData.year2025"),
      subtitle: `${t("sampleData.orderCount")} ${t(
        "registrations.totalRegistrations"
      )}`,
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-52">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
}
