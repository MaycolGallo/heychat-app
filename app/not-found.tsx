import { Header } from "@/components/ui/header";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="h-[calc(100dvh-72px)] flex flex-col items-center justify-center">
        <Image src="/logo.png" width={200} height={200} alt="logo" />
        <h2 className="text-4xl font-bold text-blue-950 dark:text-blue-50">404 Not Found</h2>
        <div className="flex flex-col  justify-center items-center gap-3 my-3">
          <p>Could not find requested resource</p>
          <Link href="/chats" className="bg-blue-950 hover:bg-blue-600 inline-block text-white px-4 py-2 rounded-lg">
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
}
