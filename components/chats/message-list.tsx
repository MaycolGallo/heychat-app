"use client";

import { getTimeForTimestamp } from "@/lib/getTimeChat";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useState, useEffect, memo, useRef, useLayoutEffect } from "react";
import { MessageBox } from "./mestr";
import { flushSync } from "react-dom";
import { ScrollAreaChat } from "../ui/chat-scroll-area";
import Dots from "../loaders/dots";
import { ArchiveX } from "lucide-react";

type MessageListProps = {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
};

export function EmptyMessages(){
  return (
    <div className="h-full flex translate-y-[-175%] items-center justify-center w-full">
      <div className="flex flex-col gap-3 items-center">
        <ArchiveX className="w-12 h-12 text-neutral-600"/>
        <p className="text-2xl font-semibold">No hay mensajes</p>
      </div>
    </div>
  )
}

const MessageList = memo(function MessageList(props: MessageListProps) {
  const { initialMessages, chatId } = props;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  console.log("messages", messages);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIncomingMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleRemovedMessage = (message: Message) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
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
    <ScrollAreaChat ref={ref} className="bg-sky-50 flex flex-col-reverse" type="always">
      <section
        data-chat={chatId}
        className="flex justify-end bg-sky-50 flex-col p-4 gap-4"
      >
        {messages?.length ? (
          messages.map((message) => {
            const isCurrentUser = message.senderId === props.sessionId;
            
            return (
              <MessageBox
                message={message}
                isCurrentUser={isCurrentUser}
                key={message.id}
              />
            );
          })
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
