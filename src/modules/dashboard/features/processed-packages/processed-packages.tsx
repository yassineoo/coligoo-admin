import ProcessedPackagesCharts from "./processed-packages-charts";
import ProcessedPackagesStats from "./processed-packages-stats";

export default function ProcessedPackages() {
  return (
    <div className="flex gap-3 w-full">
      <ProcessedPackagesCharts />
      <ProcessedPackagesStats />
    </div>
  );
}
