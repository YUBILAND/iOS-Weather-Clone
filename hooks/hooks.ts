export const getCurrentHour = (timeZone: string) => {
  const now = new Date();
  const tzs = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    hour: "numeric",
    minute: "numeric",
  });
  const tmz = tzs.format(now);

  return militaryHour(tmz);
};

export const getCurrentTime = (timeZone: string) => {
  // Create a Date object (defaults to the local timezone)
  const date = new Date();

  // Create a formatter for the timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric", // Display the hour (e.g., 6)
    minute: "2-digit", // Display the minute (e.g., 32)
    hour12: true, // Use 12-hour format (e.g., AM/PM)
    timeZone: timeZone, // Set the timezone
  });

  // Format the date to a time string
  const timeString = formatter.format(date);
  console.log(timeString); // Example: "6:32 AM"
  return timeString;
};

export function militaryHour(timeString: string) {
  // my logic is to find pm and add the hour to 12 but 12pm is an edge case
  const handle12PM = timeString.split(":")[0] != "12";

  if (timeString.includes("PM") && handle12PM) {
    // 24 hr
    return 12 + parseInt(timeString.split(":")[0]);
  }
  return parseInt(timeString.split(":")[0]);
}

export const getDate = (dateString: string) => {
  let date = new Date(dateString);
  let options: Intl.DateTimeFormatOptions = { weekday: "long" };
  let dayName = date.toLocaleDateString("en-US", options);
  return dayName;
};
