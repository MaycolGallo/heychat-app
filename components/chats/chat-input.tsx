"use client";

import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/actions/sendMessage";

export function ChatInput({ chatId }: { chatId: string }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLFormElement | null>(null);
  const rows = Math.max(5, message.split("\n").length);

  const sendMessageChat = sendMessage.bind(null, chatId);

  // const rows = Math.max(3, Math.ceil(message.length / 100));
  return (
    <section>
      <form
        ref={textareaRef}
        className="flex w-full p-4 my-4"
        action={async (formData) => {
          await sendMessageChat(formData);
          textareaRef.current?.reset();
        }}
      >
        <textarea
          rows={rows}
          name="message"
          value={message}
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
