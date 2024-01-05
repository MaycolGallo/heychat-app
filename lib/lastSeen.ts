export function lastSeen(timestamp: number) {
  const d = new Date(timestamp);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}
