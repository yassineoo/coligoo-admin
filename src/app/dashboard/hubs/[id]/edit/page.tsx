import VendorFormEdit from "@/components/hubs/VendorFormEdit";

export default async function ReturnedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <VendorFormEdit />
    </>
  );
}
