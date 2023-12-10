"use client"; // Error components must be Client Components

import Image from "next/image";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col h-[calc(100dvh-72px)] justify-center bg-sky-50 dark:text-neutral-50 dark:bg-zinc-900  items-center w-full md:max-w-[calc(100%-348px)]">
      <div>
        <Image
          src={"https://img.icons8.com/ios-filled/100/FA5252/error--v1.png"}
          width={100}
          height={100}
          alt="eror-svg"
        />
        <h2 className="text-center font-bold text-4xl">Oops! Hubo un error</h2>
      </div>
      <p>{error.message}</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Reintentar
      </button>
    </div>
  );
}
