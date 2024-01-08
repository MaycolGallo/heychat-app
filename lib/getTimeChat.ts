/**
 * Formats a given date into a string representation of time.
 *
 * @param date - The date to format.
 * @returns The formatted time string.
 */

export function getTimeForTimestamp(timestamp: number): string {
  const timeString = new Date(timestamp).toLocaleTimeString("es", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const [time, period] = timeString.split(" ");
  const formattedPeriod = period
    .replace(/\./g, "")
    .toUpperCase()
    .replace(/\s/g, "");
  return `${time} ${formattedPeriod}`;
}
