export function formatTimePassed(timestamp:number) {
  const currentTime = Date.now(); // Get the current timestamp in milliseconds

  const timePassed = currentTime - timestamp; // Calculate the time passed in milliseconds

  // Convert milliseconds to days and hours
  const hours = Math.floor(timePassed / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  // Create a new RelativeTimeFormat instance with the user's locale
  const rtf = new Intl.RelativeTimeFormat('es-pe', { numeric: "auto" });

  const unitFormat = days > 31 ? "month" : days > 365 ? "year" : "day";
  // Format the time passed
  const formattedTimePassed = rtf.format(-days, unitFormat);
  return formattedTimePassed;
}
