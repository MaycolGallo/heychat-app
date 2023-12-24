"use client";

import { Copy, Trash } from "lucide-react";
import { useCallback } from "react";

type Props = {
  containerHeight?: number;
  chatId: string;
  message: Message;
};

export function OptionsMenu(props: Props) {
  const { containerHeight, chatId, message } = props;

  const deleteMessage = useCallback(async () => {
    return await fetch("/api/messages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    });
  }, [chatId, message]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.text);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, [message]);
  return (
    <ul className="p-1 flex flex-col gap-3">
      <li className="flex px-4 py-2 items-center hover:bg-neutral-300 rounded text-red-500">
        <button
          type="button"
          // onClick={() => deleteMessage(chatId,message)}
          onClick={deleteMessage}
          className="inline-flex text-sm text-neutral-700"
        >
        <Trash className="w-4 h-4 mr-2 shrink-0 text-red-500" />
          Eliminar
        </button>
      </li>
      <li className="flex px-4 py-2 items-center hover:bg-neutral-300 rounded">
        <Copy className="w-4 h-4 mr-2 shrink-0 text-neutral-500" />
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex text-sm text-neutral-700"
        >
          Copiar
        </button>
      </li>
    </ul>
  );
}
