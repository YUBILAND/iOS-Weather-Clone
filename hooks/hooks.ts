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
