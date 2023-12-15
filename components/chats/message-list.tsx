"use client";

import { getTimeForTimestamp } from "@/lib/getTimeChat";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import {
  useState,
  useEffect,
  memo,
  useRef,
  useLayoutEffect,
  useReducer,
} from "react";
import { MessageBox } from "./mestr";
import { flushSync } from "react-dom";
import { ScrollAreaChat } from "../ui/chat-scroll-area";
import Dots from "../loaders/dots";
import { ArchiveX } from "lucide-react";

type MessageListProps = {
  initialMessages: { [key: string]: Message[] };
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
  const date = new Date(timestamp).toLocaleDateString();

  if (type === "ADD_MESSAGE") {
    return {
      ...state,
      [date]: [...(state[date] || []), payload],
    };
  }

  if (type === "REMOVE_MESSAGE") {
    const updatedMessages = {
      ...state,
      [date]: state[date].filter((message) => message.id !== payload.id),
    };

    if (updatedMessages[date].length === 0) {
      delete updatedMessages[date];
    }

    return updatedMessages;
  }

  return state;
};

const MessageList = memo(function MessageList(props: MessageListProps) {
  const { initialMessages, chatId } = props;
  const [messages, dispatch] = useReducer(reducer, initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  console.log("messages", messages);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIncomingMessage = (message: Message) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });
    };

    const handleRemovedMessage = (message: Message) => {
      dispatch({ type: "REMOVE_MESSAGE", payload: message });
    };

    const handleTyping = (data: any) => {
      const clearInterval = 900;
      let clearTimerId;

      if (data.userId !== props.sessionId) {
        setIsTyping(true);

        clearTimeout(clearTimerId);
        clearTimerId = setTimeout(() => {
          setIsTyping(false);
        }, clearInterval);
      }
    };

    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));
    pusherClient.subscribe(toPusherKey(`chat:${chatId}:messages`));
    // pusherClient.subscribe('message_typping');

    pusherClient.bind("incoming_message", handleIncomingMessage);
    pusherClient.bind("message_removed", handleRemovedMessage);
    pusherClient.bind("user_typping", handleTyping);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}:messages`));
      pusherClient.unbind("incoming_message", handleIncomingMessage);
      pusherClient.unbind("message_removed", handleRemovedMessage);
      pusherClient.unbind("user_typping", handleTyping);
    };
  }, [chatId, props.sessionId]);

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
        className="flex justify-end bg-sky-50 dark:bg-zinc-900 flex-col p-4 gap-4"
      >
        {Object.keys(messages).length ? (
          <>
            {Object.entries(messages).map(([key, message]) => (
              <ul key={key} className="flex flex-col gap-3">
                <span className="mx-auto text-sm bg-zinc-300 px-2 py-1 rounded dark:bg-neutral-600 dark:text-white">{key}</span>
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
          </>
        ) : (
          <EmptyMessages />
        )}
        {isTyping && (
          <div className="flex fixed animate-in slide-in-from-bottom-0 animate-out slide-out-to-bottom-48 bottom-20 left-1/2 justify-start">
            <span className="bg-neutral-300 w-16 p-2 rounded-md">
              <Dots />
            </span>
          </div>
        )}
      </section>
    </ScrollAreaChat>
  );
});

export default MessageList;
