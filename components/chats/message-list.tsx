"use client";

import { useState, memo, useRef, useLayoutEffect, useReducer } from "react";
import { MessageBox } from "./message-box";
import { ScrollAreaChat } from "../ui/chat-scroll-area";
import Dots from "../loaders/dots";
import { useRouter } from "next/navigation";
import { ArchiveX } from "lucide-react";
import { useParty } from "@/party/useParty";
import usePartySocket from "partysocket/react";
import { AnimatePresence, motion } from "react-magic-motion";

type MessageListProps = {
  initialMessages: Record<string, Message[]>;
  sessionId: string;
  chatId: string;
};

export function EmptyMessages() {
  return (
    <div className="h-full flex translate-y-[-175%] items-center justify-center w-full">
      <div className="flex flex-col gap-3 items-center">
        <ArchiveX className="w-12 h-12 text-neutral-600" />
        <p className="text-2xl font-semibold">No hay mensajes</p>
      </div>
    </div>
  );
}

const reducer = (
  state: MessageListProps["initialMessages"],
  action: { type: string; payload: Message }
) => {
  if (!action) {
    return state;
  }

  const { type, payload } = action;
  const { timestamp } = payload;
  const date = new Date(timestamp).toLocaleDateString("es-ES");

  switch (type) {
    case "ADD_MESSAGE": {
      const newState = { ...state };
      newState[date] = [...(newState[date] || []), payload];
      return newState;
    }

    case "REMOVE_MESSAGE": {
      const newState = { ...state };
      newState[date] = newState[date].filter(
        (message) => message.id !== payload.id
      );
      if (newState[date].length === 0) {
        delete newState[date];
      }
      return newState;
    }

    default:
      return state;
  }
};

const MessageList = memo(function MessageList(props: MessageListProps) {
  const { initialMessages, chatId } = props;
  const [messages, dispatch] = useReducer(reducer, initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  // const { socket } = useParty(chatId);
  usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: chatId,
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "typing":
          const clearInterval = 900;
          let clearTimerId;

          if (message.userId !== props.sessionId) {
            setIsTyping(true);

            clearTimeout(clearTimerId);
            clearTimerId = setTimeout(() => {
              setIsTyping(false);
            }, clearInterval);
          }
          break;
        case "add_message":
          dispatch({ type: "ADD_MESSAGE", payload: message.message });
          break;
        case "delete_message":
          console.log("removed", message);
          dispatch({ type: "REMOVE_MESSAGE", payload: message.message });
          break;
        default:
          break;
      }
    },
  });

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    ref.current.scrollBy({
      top: ref.current.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <ScrollAreaChat
      ref={ref}
      className="bg-sky-50 dark:bg-zinc-900 flex h-full max-h-full flex-grow"
      type="always"
    >
      <section
        data-chat={chatId}
        className="flex justify-end max-w-screen-lg mx-auto bg-sky-50 dark:bg-zinc-900 flex-col p-4 gap-4"
      >
        {Object.keys(messages).length ? (
          <AnimatePresence mode="popLayout" initial={false}>
            {Object.entries(messages).map(([key, message]) => (
              <ul key={key} className="flex flex-col gap-3">
                <span className="mx-auto text-sm bg-zinc-300 px-3 py-1 rounded-full dark:bg-neutral-600 dark:text-white">
                  {key}
                </span>
                {message.map((message) => {
                  const isCurrentUser = message.senderId === props.sessionId;

                  return (
                    <MessageBox
                      message={message}
                      isCurrentUser={isCurrentUser}
                      key={message.id}
                    />
                  );
                })}
              </ul>
            ))}
          </AnimatePresence>
        ) : (
          <EmptyMessages />
        )}

        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, bottom: "-10rem",scale:0.8 }}
              animate={{ opacity: 1, bottom: "5rem",scale:1 }}
              exit={{ opacity: 0, bottom: "-10rem" ,scale:0.8 }}
              className="inline-flex items-center fixed left-1/2 justify-center"
            >
              <span className="bg-neutral-300 dark:text-neutral-100 dark:bg-neutral-600 px-4 py-2 rounded-full">
                <Dots />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </ScrollAreaChat>
  );
});

export default MessageList;
