import AddModerator from "@/components/moderators/AddModerators";

export default async function ReturnedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <AddModerator />
    </>
  );
}
