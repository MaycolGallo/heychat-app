"use client";

import { getTimeForTimestamp } from "@/lib/getTimeChat";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { useState, useEffect, memo } from "react";
import { Mest } from "./mestr";

type MessageListProps = {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
};

export const MessageList = memo(
  function MessageList(props: MessageListProps) {
    const { initialMessages, chatId } = props;
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    // const [hoveredId, setHoveredId] = useState('');
    console.log('messages', messages);
  
    useEffect(() => {
      const handleIncomingMessage = (message: Message) => {
        console.log(message);
        setMessages((prev) => [...prev, message]);
      };

      const handleRemovedMessage = (message: Message) => {
        console.log('deleted this lil', message);
        setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
      };

      pusherClient.subscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.subscribe(toPusherKey(`chat:${chatId}:messages`));
  
      pusherClient.bind("incoming_message", handleIncomingMessage);
      pusherClient.bind('message_removed', handleRemovedMessage);
  
      return () => {
        pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
        pusherClient.unbind("incoming_message", handleIncomingMessage);
        pusherClient.unsubscribe(toPusherKey(`chat:${chatId}:messages`));
        pusherClient.unbind('message_removed', handleRemovedMessage);
      };
    }, [chatId]);
  
    return (
      <section data-chat={chatId} className="flex flex-col p-4 gap-4">
        {messages?.length ? (
          messages.map((message) => {
            const isCurrentUser = message.senderId === props.sessionId;
            const isLastMessage =
              message.id === initialMessages[initialMessages.length - 1].id;
            return (
              <Mest message={message} isCurrentUser={isCurrentUser} key={message.id}/>
            );
          })
        ) : (
          <div>no messages</div>
        )}
      </section>
    );
  }
)

