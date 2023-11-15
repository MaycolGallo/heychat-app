export function getTimeForTimestamp(timestamp: number) {
  return new Intl.DateTimeFormat("es-pe", {
    hour: "numeric",
    minute: "numeric",
  }).format(timestamp);
}
