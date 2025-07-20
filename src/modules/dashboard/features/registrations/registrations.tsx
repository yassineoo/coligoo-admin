import RegistrationsChart from "./registrations-chart";
import RegistrationsStats from "./registrations-stats";

export default function Registrations() {
  return (
    <div className="flex gap-3 w-full">
      <RegistrationsChart />
      <RegistrationsStats />
    </div>
  );
}
