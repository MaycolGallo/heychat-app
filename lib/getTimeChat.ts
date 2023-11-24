/**
 * Formats a given date into a string representation of time.
 *
 * @param date - The date to format.
 * @returns The formatted time string.
 */
export function getTimeForTimestamp(timestamp: number): string {
  const hour = new Date(timestamp).getHours();
  const minute = new Date(timestamp).getMinutes();

  const formattedHour = hour.toString().padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";
  const formattedTime = `${formattedHour}:${minute
    .toString()
    .padStart(2, "0")} ${period}`;

  return formattedTime;
}
