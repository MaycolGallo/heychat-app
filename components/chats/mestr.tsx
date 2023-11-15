"use client";

import { useState } from "react";
import { DropdownBody } from "./mess-options";
import { getTimeForTimestamp } from "@/lib/getTimeChat";
import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";

type MessageItem = {
  message: Message;
  isCurrentUser: boolean;
};

export function MessageBox(props: MessageItem) {
  const [hoveredId, setHoveredId] = useState("");
  const [contentOpen, setContentOpen] = useState(false);
  const path = useParams();

  const { message, isCurrentUser } = props;
  return (
    <div
      onMouseEnter={() => {
        setHoveredId(message.id);
      }}
      onMouseLeave={() => {
        setHoveredId("");
      }}
      key={message.id}
      className={`flex relative items-end space-x-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {isCurrentUser ? (
        <div className="relative">
          <button
            onClick={() => setContentOpen(!contentOpen)}
            className={` p-2 rounded-full hover:bg-neutral-100 ${
              message.id === hoveredId ? "block" : "hidden"
            }`}
          >
            <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
          </button>
          {contentOpen && message.id === hoveredId ? (
            <DropdownBody chatId={path.chatId as string} message={message} />
          ) : null}
        </div>
      ) : null}
      <span
        className={`inline-block max-w-[275px] relative px-3 py-1.5 rounded-2xl ${
          isCurrentUser ? "bg-blue-600 text-white" : "bg-neutral-300 text-black"
        }`}
      >
        {message.text}
        <>&bull;</>
        <span className="text-xs ml-1">
          {getTimeForTimestamp(message.timestamp)}
          
        </span>
      </span>
      
    </div>
  );
}

