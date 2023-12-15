import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full p-4 md:flex flex-col bg-sky-50 dark:bg-zinc-900 lg:w-[calc(100%-384px)]">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-44 my-3" />
        <div className="request-container my-3">
          <section className="grid grid-cols-1 requests gap-3">
            <Skeleton className="h-[5.5rem] w-full" />
            <Skeleton className="h-[5.5rem] w-full" />
          </section>
        </div>
      </div>
    </div>
  );
}
