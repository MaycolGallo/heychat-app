import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full p-4 md:flex flex-col lg:w-[calc(100%-384px)]">
      <div>
        <Skeleton className="h-12 w-64" />
        <div className="space-y-2 my-3">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
