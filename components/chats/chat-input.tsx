"use client";

import { memo, useRef, useState } from "react";
import { Loader, Send } from "lucide-react";
import { sendMessage } from "@/app/actions/sendMessage";
import throttle from "lodash.throttle";
import { useActionState } from "@/lib/use-form-state";
import TextareaAutosize from "react-textarea-autosize";
import { useParty } from "@/party/useParty";

export const ChatInput = memo(function ChatInput({
  chatId,
  userId,
  isBlocked,
}: {
  chatId: string;
  userId: string;
  isBlocked?: string | false;
}) {
  const [message, setMessage] = useState("");
  const sendMessageChat = sendMessage.bind(null, chatId);
  const [sendMessageState, { loading }] = useActionState(sendMessageChat);
  const textareaRef = useRef<HTMLFormElement | null>(null);
  const { socket } = useParty(chatId);

  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (formData: FormData) => {
    await sendMessageState(formData);
    setMessage("");
    const mess = formData.get("message")?.toString();
    socket.send(JSON.stringify({ type: "fresh_message", newMessage: mess }));
  };

  function isTypping() {
    socket.send(JSON.stringify({ type: "typing", userId }));
  }

  return (
    <section className="sticky bottom-0 bg-neutral-50 dark:border-neutral-700/70 dark:bg-neutral-900 border-t border-neutral-300">
      {!isBlocked ? (
        <form
          ref={textareaRef}
          className="flex w-full gap-3 px-3 py-3"
          action={handleSubmit}
        >
          <label
            className="relative w-full inline-flex flex-col"
            htmlFor="message"
          >
            {/* <textarea
          rows={rows}
          name="message"
          maxLength={300}
          value={message}
          // onKeyUp={tohle}
          // onKeyUp={handleTyping}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full focus:outline-transparent focus:ring-2 ring-blue-700 relative p-3 pr-12 rounded-xl border border-neutral-300 bg-neutral-100 resize-none"
        /> */}
            <TextareaAutosize
              minRows={1}
              maxRows={4}
              required
              // onKeyUp={throttle(isTypping, 500)}
              onKeyUp={isTypping}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              name="message"
              className="w-full focus-visible:outline-none ring-offset-2 dark:ring-offset-neutral-900 dark:bg-neutral-800 focus:ring-2 ring-blue-700 relative p-3 pr-12 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 resize-none"
            />
            <button
              type="submit"
              aria-busy={loading}
              className="bg-blue-900 text-white rounded-lg p-2 absolute bottom-2 right-2 hover:bg-blue-900"
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </label>
        </form>
      ) : isBlocked === "te han bloqueado" ? (
        <p className="text-center text-red-500 px-4 py-2">
          No puedes responder en este chat
        </p>
      ) : (
        <p className="text-center px-4 py-2 text-red-500">
          Has bloqueado a este usuario
        </p>
      )}
    </section>
  );
});
