export default function ErrorMessage({ message }: { message: string }) {
  return <div className="text-red-500 text-sm mt-1">{message}</div>;
}
