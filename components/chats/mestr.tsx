"use client";

import { useRef, useState } from "react";
import { DropdownBody } from "./message-options";
import { getTimeForTimestamp } from "@/lib/getTimeChat";
import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { Dropdon } from "../dropdon";

type MessageItem = {
  message: Message;
  isCurrentUser: boolean;
};

export function MessageBox(props: MessageItem) {
  const [hoveredId, setHoveredId] = useState("");
  const [contentOpen, setContentOpen] = useState(false);
  const path = useParams();
  const ref = useRef<HTMLDivElement | null>(null);
  const containerHeight =
    ref.current?.parentElement?.parentElement?.parentElement?.clientHeight || 0;

  const { message, isCurrentUser } = props;
  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        setHoveredId(message.id);
      }}
      onMouseLeave={() => {
        setHoveredId("");
      }}
      key={message.id}
      className={`flex flex-col relative space-x-2 ${
        isCurrentUser ? "justify-end items-end" : "justify-start items-start "
      }`}
    >
      <div className="flex items-center gap-2">
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
              // <DropdownBody chatId={path.chatId as string} message={message} />
              <Dropdon containerHeight={containerHeight} chatId={path.chatId as string} message={message}/>
            ) : // <Mu />
            null}
          </div>
        ) : null}
        <span
          className={`inline-block max-w-[275px] relative px-3 py-1.5 rounded-2xl ${
            isCurrentUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-neutral-300 text-black rounded-tl-sm"
          }`}
        >
          {message.text}
        </span>
      </div>

      <span
        className={`text-xs ${
          isCurrentUser ? "self-end" : "self-start"
        } py-1.5`}
      >
        {getTimeForTimestamp(message.timestamp)}
      </span>
    </div>
  );
}
