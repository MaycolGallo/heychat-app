"use client";

import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/actions/sendMessage";
import throttle from "lodash.throttle";

export function ChatInput({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLFormElement | null>(null);
  const rows = Math.max(1, message.split("\n").length);

  const sendMessageChat = sendMessage.bind(null, chatId);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (formData: FormData) => {
    await sendMessageChat(formData);
    setMessage("");
  };

  const tohle = throttle(
    async () => {
      try {
        await fetch(`/api/typping`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId,
            userId,
          }),
          // signal,
        });
      } catch (error) {
        console.error(error);
      }
    },
    5000,
    { trailing: true, leading: true }
  );

  const handleTyping = async () => {
    let canPublish = true;
    let throttleTime = 200;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      await fetch(`/api/typping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          userId,
        }),
        signal,
      });
    } catch (error) {
      console.error(error);
    }

    // if (canPublish) {
    //   try {
    //     const response = await fetch(`/api/typping`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         chatId,
    //         userId,
    //       }),
    //       signal,
    //     });
    //     if (response.ok) {
    //       canPublish = false;

    //       setTimeout(() => {
    //         canPublish = true;
    //       }, throttleTime);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
  };

  // const rows = Math.max(3, Math.ceil(message.length / 100));
  return (
    <section className="sticky bottom-0 bg-white border-t border-neutral-300">
      <form
        ref={textareaRef}
        className="flex w-full gap-3 px-3 py-3"
        action={handleSubmit}
      >
        <label
          className="relative w-full inline-flex flex-col"
          htmlFor="message"
        >
          <textarea
            rows={rows}
            name="message"
            maxLength={300}
            value={message}
            onKeyUp={tohle}
            // onKeyUp={handleTyping}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full focus:outline-transparent focus:ring-2 ring-blue-700 relative p-3 pr-12 rounded-xl border border-neutral-300 bg-neutral-100 resize-none"
          />
          <button
            type="submit"
            className="bg-blue-900 text-white rounded-lg p-2 absolute bottom-2 right-2 hover:bg-blue-900"
          >
            <Send className="h-4 w-4" />
          </button>
        </label>
      </form>
    </section>
  );
}
