export function lastSeen(timestamp: number) {
  if (typeof window === "undefined") {
    // Server-side rendering (SSR) path
    return "";
  }
  const d = new Date(timestamp);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}
