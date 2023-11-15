"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/actions/sendMessage";
import { pusherClient, pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export function ChatInput({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLFormElement | null>(null);
  const rows = Math.max(1, message.split("\n").length);

  const sendMessageChat = sendMessage.bind(null, chatId);

  const handleSubmit = async (formData: FormData) => {
    await sendMessageChat(formData);
    setMessage("");
  };

const handleTyping = async () => {
  let canPublish = true;
  let throttleTime = 200;

  if (canPublish) {
    try {
      const response = await fetch(`/api/typping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          userId,
        }),
      });
      if (response.ok) {
        canPublish = false;

        setTimeout(() => {
          canPublish = true;
        }, throttleTime);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

  // const rows = Math.max(3, Math.ceil(message.length / 100));
  return (
    <section className="sticky bottom-0 bg-whites border-t border-neutral-300">
      <form
        ref={textareaRef}
        className="flex w-full gap-3 px-2 my-4"
        action={handleSubmit}
      >
        <textarea
          rows={rows}
          name="message"
          maxLength={300}
          value={message}
          onKeyUp={handleTyping}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded-xl border border-neutral-300 bg-neutral-100 resize-none"
        />
        <Button type="submit" className="bg-violet-500 hover:bg-violet-600">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </section>
  );
}
