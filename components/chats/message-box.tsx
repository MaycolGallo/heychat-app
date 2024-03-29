"use client";

import { useRef, useState } from "react";
import { getTimeForTimestamp } from "@/lib/getTimeChat";
import { MoreHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { OptionsMenu } from "../options-menu";
import { AnimatePresence, motion } from "react-magic-motion";

type MessageItem = {
  message: Message;
  isCurrentUser: boolean;
};

export function MessageBox(props: MessageItem) {
  const [hoveredId, setHoveredId] = useState("");
  const [contentOpen, setContentOpen] = useState(false);
  const path = useParams();
  const ref = useRef<HTMLDivElement | null>(null);

  const { message, isCurrentUser } = props;
  return (
    <div
      ref={ref}
      onMouseEnter={() => {
        setHoveredId(message.id);
      }}
      onMouseLeave={() => {
        setHoveredId("");
        setContentOpen(false);
      }}
      key={message.id}
      className={`flex flex-col relative space-x-2 ${
        isCurrentUser ? "justify-end items-end" : "justify-start items-start "
      }`}
    >
      <div className="flex transition-all items-center gap-2">
        {isCurrentUser ? (
          <Popover
            key={message.id}
            open={contentOpen}
            onOpenChange={setContentOpen}
          >
            <PopoverTrigger
              className={cn(
                "p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700",
                message.id === hoveredId ? "block" : "hidden"
              )}
            >
              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
            </PopoverTrigger>
            {contentOpen && message.id === hoveredId ? (
              <PopoverContent className="w-36 p-1" align="end" contextMenu="">
                <OptionsMenu message={message} chatId={path.chatId as string} />
              </PopoverContent>
            ) : null}
          </Popover>
        ) : null}
        <motion.span
          // key={message.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring" }}
          layout
          className={`inline-block animate-in fade-in max-w-[275px] relative px-3 py-1.5 rounded-2xl ${
            isCurrentUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 text-black rounded-tl-sm"
          }`}
        >
          {message.text}
        </motion.span>
      </div>

      <span
        className={`text-xs ${
          isCurrentUser ? "self-end" : "self-start"
        } py-1.5`}
        suppressHydrationWarning
      >
        {getTimeForTimestamp(message.timestamp)}
      </span>
    </div>
  );
}
