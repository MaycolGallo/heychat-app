"use client";

import { Trash } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Props = {
  containerHeight: number;
  chatId: string;
  message: Message;
};

export function Dropdon(props: Props) {
  const { containerHeight, chatId, message } = props;
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const dropwdoneRef = useRef<HTMLDivElement | null>(null);

  function toggleDropdown() {
    setOpen(!open);
    console.log(dropwdoneRef.current);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropwdoneRef.current &&
        !dropwdoneRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deleteMessage = useCallback(async () => {
    return await fetch("/api/messages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    });
  }, [chatId, message]);

  useLayoutEffect(() => {
    function calculatePosition() {
      if (dropwdoneRef.current) {
        const dropHeight = dropwdoneRef.current?.clientHeight || 0;
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const scrollY = dropwdoneRef.current.parentElement?.scrollTop || 0;
        const triggerRect = dropwdoneRef.current?.getBoundingClientRect();

        // Check whether the dropdown exceeds the window height when opened. This can happen if the sum of
        // the dropdown's top position (triggerRect.top) and its height (dropHeight) exceeds the available
        // space in the window (windowHeight - scrollY).
        const isDropdownExceedingWindow =
          triggerRect &&
          triggerRect.top + dropHeight > containerHeight - scrollY;

        const isDropdownOverflowingLeft = triggerRect && triggerRect.left < scrollY;
        console.log(isDropdownOverflowingLeft,triggerRect?.left,scrollY);

        if (isDropdownOverflowingLeft) {
          dropwdoneRef.current.style.right = "-150%";
        }

        if (isDropdownExceedingWindow) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }
    }
    calculatePosition();
  }, [containerHeight]);

  return (
    <div className="relative h-max">
      <div
        ref={dropwdoneRef}
        className={`absolute z-10 border shadow backdrop-blur-md border-neutral-400 rounded-lg w-36 right-0 bg-white/75 ${
          dropdownPosition === "top" ? "bottom-9" : "top-full"
        }`}
      >
        <ul className="p-1 flex flex-col gap-3">
          <li className="flex px-4 py-2 items-center hover:bg-neutral-300 rounded text-red-500">
            <Trash className="w-4 h-4 mr-2 shrink-0" />
            <button
              type="button"
              // onClick={() => deleteMessage(chatId,message)}
              onClick={deleteMessage}
              className="inline-flex text-sm text-neutral-700"
            >
              Eliminar
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
