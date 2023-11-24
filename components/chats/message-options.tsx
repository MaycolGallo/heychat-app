"use client";

import { db } from "@/lib/db";
import { pusherClient } from "@/lib/pusher";
import { useCallback, useEffect, useState } from "react";

type Props = {
  chatId: string;
  message: Message;
};

export function DropdownBody(props: Props) {
  const { chatId, message } = props;
  // useEffect(() => {
  //   pusherClient.subscribe(`chat:${chatId}:messages`, (message) => {
      
  //   });
  // }, []);

  const deleteMessage = useCallback(async () => {
    const result = await fetch("/api/messages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    });
    return result;
  }, [chatId, message]);

  return (
    <div className="absolute top-4 right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
      <div className="py-1">
        <button
          type="button"
          // onClick={() => deleteMessage(chatId,message)}
          onClick={deleteMessage}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Delete message
        </button>
        <button
          type="button"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Item 2
        </button>
        <button
          type="button"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          Item 3
        </button>
      </div>
    </div>
  );
}
