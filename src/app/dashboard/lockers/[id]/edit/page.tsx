import EditLockerForm from "@/components/lockers/EditLockerForm";

export default async function EditLockerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditLockerForm lockerId={id} />;
}
