import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPusherKey(key: string) {
  return key.replace(/:/g, "__");
}

export function linkChatSorted(id1: string, id2: string) {
  const sorted = [id1, id2].sort();
  return `${sorted[0]}--${sorted[1]}`;
}
