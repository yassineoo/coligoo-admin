import Insights from "./features/insights/insights";
import ProcessedPackages from "./features/processed-packages/processed-packages";
import Registrations from "./features/registrations/registrations";
import { useTranslations } from "next-intl";

export default function DashboardScreen() {
  const t = useTranslations();
  return (
    <div className=" space-y-8 ">
      <Insights />
      <div className="space-y-4">
        <h2>{t("processedPackages.title")}</h2>
        <ProcessedPackages />
      </div>
      <div className="space-y-4">
        <h2>{t("registrations.title")}</h2>
        <Registrations />
      </div>
    </div>
  );
}
