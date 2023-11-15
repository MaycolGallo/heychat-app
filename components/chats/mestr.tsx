"use client";

import { useState } from "react";
import { DropdownBody } from "./mess-options";
import { getTimeForTimestamp } from "@/lib/getTimeChat";
import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";

type Lo = {
  message: Message;
  isCurrentUser: boolean;
};

export function Mest(props: Lo) {
  const [hoveredId, setHoveredId] = useState("");
  const [contentOpen, setContentOpen] = useState(false);
  const path = useParams()

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
        <button
          onClick={() => setContentOpen(!contentOpen)}
          className={`relative p-2 rounded-full hover:bg-neutral-100 ${
            message.id === hoveredId ? "block" : "hidden"
          }`}
        >
          <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : null}
      {contentOpen && message.id === hoveredId ? <DropdownBody chatId={path.chatId} message={message} /> : null}
      <span
        className={`inline-block px-3 py-1 rounded-2xl ${
          isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
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
