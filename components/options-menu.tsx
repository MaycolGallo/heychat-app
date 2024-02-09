"use client";

import { removeMessage } from "@/app/actions/remove";
import { Copy, CopyCheck, Trash } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  containerHeight?: number;
  chatId: string;
  message: Message;
};

export function OptionsMenu(props: Props) {
  const { containerHeight, chatId, message } = props;
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setIsCopied(true);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, [message]);

  return (
    <ul className="p-1 flex flex-col gap-3">
      <li className="flex px-4 py-2 items-center hover:bg-red-300 rounded text-red-500">
        <button
          type="button"
          // onClick={() => deleteMessage(chatId,message)}
          onClick={async ()=> removeMessage(chatId,message)}
          className="inline-flex text-sm text-neutral-700"
        >
        <Trash className="w-4 h-4 mr-2 shrink-0 text-red-500" />
          Eliminar
        </button>
      </li>
      <li className="flex px-4 py-2 items-center hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded">
        {isCopied ? <CopyCheck className="w-4 h-4 mr-2 shrink-0 text-neutral-500" />: <Copy className="w-4 h-4 mr-2 shrink-0 text-neutral-500" />}
        <button
          type="button"
          onClick={copyToClipboard}
          className="inline-flex text-sm text-neutral-700 dark:text-neutral-300"
        >
          {isCopied ? "Copiado" : "Copiar"}
        </button>
      </li>
    </ul>
  );
}
