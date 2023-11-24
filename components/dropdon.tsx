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
        className={`absolute z-10 border rounded-lg w-36 right-0 bg-white ${
          dropdownPosition === "top" ? "bottom-9" : "top-full"
        }`}
      >
        <ul>
          <li className="flex text-red-500 items-center gap-3">
            <Trash className="w-4 h-4"/>
            <button
              type="button"
              // onClick={() => deleteMessage(chatId,message)}
              onClick={deleteMessage}
              className="inline-flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >Eliminar</button>
          </li>
          <li>Skidibid Toilet 2</li>
          <li>Skidibid Toilet 3</li>
        </ul>
      </div>
    </div>
  );
}
