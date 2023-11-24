"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function Mu() {
  const ref = useRef(null);
  console.log(ref);
  return <div ref={ref}>jello</div>;
}

export function Dropdon({ containerHeight }: { containerHeight: number }) {
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
          triggerRect && triggerRect.top + dropHeight > containerHeight - scrollY;

        if (isDropdownExceedingWindow) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
        console.log("dropHeight", dropHeight);
        console.log("windowHeight", windowHeight);
        console.log("scrollY", scrollY);
        console.log("triggerRect", triggerRect);
        console.log("isDropdownExceedingWindow", isDropdownExceedingWindow);
        console.log(
          "dropdownPosition",
          dropwdoneRef.current?.getBoundingClientRect()
        );
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
          <li>Skidibid Toilet</li>
          <li>Skidibid Toilet 2</li>
          <li>Skidibid Toilet 3</li>
        </ul>
      </div>
    </div>
  );
}
