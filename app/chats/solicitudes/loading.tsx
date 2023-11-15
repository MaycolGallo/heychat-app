import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      {Array(10)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="mb-4 h-16" />
        ))}
    </>
  );
}
