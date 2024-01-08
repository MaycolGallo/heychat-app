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
import { useRouter } from "next/navigation";
import { ArchiveX } from "lucide-react";
import { useParty } from "@/party/useParty";

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
  const date = new Date(timestamp).toLocaleDateString('es-ES');

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
  const router = useRouter();
  const { socket } = useParty(chatId);

  const ref = useRef<HTMLDivElement>(null);
  console.log('brother im displayed in prod?',messages);

  useEffect(() => {
    const handleIncomingMessage = (message: Message) => {
      dispatch({ type: "ADD_MESSAGE", payload: message });
    };

    const handleRemovedMessage = (message: Message) => {
      // router.refresh();
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

    // pusherClient.subscribe(toPusherKey(`chat:${chatId}`));
    // pusherClient.subscribe(toPusherKey(`chat:${chatId}:messages`));
    // pusherClient.subscribe('message_typping');

    // pusherClient.bind("incoming_message", handleIncomingMessage);
    // pusherClient.bind("message_removed", handleRemovedMessage);

    return () => {
      // pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      // pusherClient.unsubscribe(toPusherKey(`chat:${chatId}:messages`));
      // pusherClient.unbind("incoming_message", handleIncomingMessage);
      // pusherClient.unbind("message_removed", handleRemovedMessage);
    };
  }, [chatId, props.sessionId]);

  useEffect(() => {
    const handleSocket = (event: MessageEvent) => {
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
          console.log('removed',message);
          dispatch({ type: "REMOVE_MESSAGE", payload: message.message });
          break;
        default:
          break;
      }
    };
    socket.addEventListener("message", handleSocket);

    return () => socket.removeEventListener("message", handleSocket);
  }, [socket, props.sessionId]);

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
          <>
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
          </>
        ) : (
          <EmptyMessages />
        )}
        {isTyping && (
          <div className="inline-flex items-center fixed animate-in slide-in-from-bottom-0 bottom-20 left-1/2 justify-center">
            <span className="bg-neutral-300 dark:text-neutral-100 dark:bg-neutral-600 px-4 py-2 rounded-full">
              <Dots />
            </span>
          </div>
        )}
      </section>
    </ScrollAreaChat>
  );
});

export default MessageList;
