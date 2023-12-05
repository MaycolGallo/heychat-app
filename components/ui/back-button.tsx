"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useViewportSize } from "@/lib/useViewport";

export function BackButton() {
  const router = useRouter();
  const params = useParams();
  const { width } = useViewportSize();
  return (
    <>
      {params.chatId && width < 768 ? (
        <button onClick={() => router.back()} className="p-0.5">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}
