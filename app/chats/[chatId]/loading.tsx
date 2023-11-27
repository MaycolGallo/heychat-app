import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="w-full md:flex flex-col lg:w-[calc(100%-384px)]">
      <header className="bg-white h-[72px] p-4 flex items-center gap-3 border-b border-neutral">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-3 w-32 rounded-full" />
        </div>
      </header>
      <section className="h-[calc(100vh-72px)] py-5 flex flex-col-reverse bg-sky-50">
        <Skeleton className="h-16 w-24" />
      </section>
      <footer className="h-[72px] sticky bottom-0 p-4 bg-white border-t border-neutral">
        <Skeleton className="h-10 w-full rounded-xl" />
      </footer>
    </main>
  );
}
