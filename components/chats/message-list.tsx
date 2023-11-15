"use client";

import { getTimeForTimestamp } from "@/lib/getTimeChat";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useState, useEffect, memo, useRef } from "react";
import { MessageBox } from "./mestr";
import { ScrollArea } from "../ui/scroll-area";
import { flushSync } from "react-dom";

type MessageListProps = {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
};

export const MessageList = memo(function MessageList(props: MessageListProps) {
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
      console.log("deleted this lil", message);
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    };

    const handleTyping = (data: any) => {
      let clearInterval = 900;
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

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages]);

  return (
    <ScrollArea ref={ref} type="always" onScroll={(e) => {console.log(e)}} className="h-[calc(100vh-200px)]">
      <section
      onScroll={(e) => {console.log(e)}}
        data-chat={chatId}
        className="flex justify-end bg-sky-50 flex-col p-4 gap-4"
      >
        {messages?.length ? (
          messages.map((message) => {
            const isCurrentUser = message.senderId === props.sessionId;
            // const isLastMessage =
            //   message.id === initialMessages[initialMessages.length - 1].id;
            return (
                <MessageBox
                  message={message}
                  isCurrentUser={isCurrentUser}
                  key={message.id}
                />
            );
          })
        ) : (
          <div>no messages</div>
        )}
        {/* {isTyping && (
          
        )} */}
        <div className="text-sm w-16 bg-neutral-300 rounded-full p-3 text-gray-500">
          ...
        </div>
      </section>
    </ScrollArea>
  );
});
