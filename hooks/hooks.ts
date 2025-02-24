import { days } from "@/utils/exampleForecast";

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
  // console.log(timeString); // Example: "6:32 AM"
  return timeString;
};

export const getCurrentDate = (timeZone: string) => {
  let date = new Date();

  const tzDate = date.toLocaleString("en-US", {
    timeZone: timeZone,
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  // console.log(tzDate);

  const month = parseInt(tzDate.split("/")[0]);
  const day = parseInt(tzDate.split("/")[1]);
  const year = parseInt(tzDate.split("/")[2]);

  const weekday = date.toLocaleString("en-US", {
    timeZone: timeZone,
    weekday: "long",
  });

  return { month, day, year, weekday };
};

export function getCalendarDate(timeZone: string, incrementBy: number) {
  let date = new Date();
  date.setUTCDate(date.getUTCDate() + incrementBy);

  const tzs = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const tmz = tzs.format(date);
  return tmz;
}

export function militaryHour(timeString: string) {
  // my logic is to find pm and add the hour to 12 but 12pm is an edge case
  const containsTwelve = timeString.split(":")[0] === "12";

  // Handles 12PM
  if (timeString.includes("PM") && !containsTwelve) {
    // 24 hr
    const add12 = 12 + parseInt(timeString.split(":")[0]);
    return add12;
  }

  // Handles 12AM
  if (timeString.includes("AM") && containsTwelve) {
    return 0;
  }

  return parseInt(timeString.split(":")[0]);
}

export const getDate = (dateString: string) => {
  let date = new Date(dateString);
  let options: Intl.DateTimeFormatOptions = { weekday: "long" };
  let dayName = date.toLocaleDateString("en-US", options);
  return dayName;
};

export function getRemainingTimeUntilNextPhase(
  currentTime: string,
  nextPhaseTime: string
) {
  const hourDifference =
    militaryHour(currentTime) > militaryHour(nextPhaseTime)
      ? 24 + militaryHour(nextPhaseTime) - militaryHour(currentTime)
      : militaryHour(nextPhaseTime) - militaryHour(currentTime);

  const minuteDifference =
    parseInt(nextPhaseTime.split(":")[1].split(" ")[0]) -
    parseInt(currentTime.split(":")[1].split(" ")[0]);

  let remainingHours = hourDifference;
  let remainingMinutes = 0;

  if (minuteDifference < 0) {
    remainingHours -= 1;
    remainingMinutes += 60 + minuteDifference;
  } else {
    remainingMinutes += minuteDifference;
  }

  const remainingTime =
    Math.abs(remainingHours).toString() +
    ":" +
    (remainingMinutes < 10
      ? "0" + remainingMinutes.toString()
      : remainingMinutes.toString());
  return remainingTime;
}

export function getChordLength(
  sunriseTime: string,
  sunsetTime: string,
  realTime: boolean = false
) {
  const hourDifference = Math.abs(
    militaryHour(sunsetTime) - militaryHour(sunriseTime)
  );
  const sunriseMinutePortion = parseInt(
    sunriseTime.split(":")[1].split(" ")[0]
  );
  const sunsetMinutePortion = parseInt(sunsetTime.split(":")[1].split(" ")[0]);
  const minuteDifference = Math.abs(sunsetMinutePortion - sunriseMinutePortion);

  let chordLength = hourDifference;
  if (sunsetMinutePortion > sunriseMinutePortion) {
    chordLength += realTime ? minuteDifference / 100 : minuteDifference / 60;
  } else {
    chordLength -= realTime ? minuteDifference / 100 : minuteDifference / 60;
  }
  return chordLength;
}

export function removeZeroFromTimeString(timeString: string | null) {
  if (timeString) {
    if (timeString[0] === "0") {
      return timeString.slice(1);
    }
    return timeString;
  }
  return "";
}

export const timeFormat = (
  americanTime: boolean,
  removeMinutes = false
): Intl.DateTimeFormatOptions => ({
  hour: "numeric",
  minute: removeMinutes ? undefined : "numeric", // Ternary operator
  hour12: americanTime,
});

export function stringToTime(
  americanTime: boolean,
  timeString: string,
  removeMinutes: boolean = false,
  addMinutes: number = 0
) {
  let minutes =
    timeString.includes("AM") || timeString.includes("PM")
      ? timeString.split(":")[1].split(" ")[0]
      : timeString.split(":")[1];
  minutes = (parseInt(minutes) + addMinutes).toString();
  const date = new Date();
  date.setHours(militaryHour(timeString));
  date.setMinutes(parseInt(minutes));
  const time = removeZeroFromTimeString(
    date.toLocaleTimeString("en-US", timeFormat(americanTime, removeMinutes))
  );
  return time;
}

export const getDaysOfMonth = (y: number, m: number) =>
  new Date(y, m, 0).getDate();

export const getScrollDates = (
  numberOfDays: number,
  month: number,
  day: number,
  year: number,
  weekday: string
) => {
  const xCountArray = [...Array(numberOfDays).keys()];
  const currentWeekdayIndex = days.indexOf(weekday);

  const scrollWeekdayLetters = xCountArray.map((val) => {
    return days[(currentWeekdayIndex + val) % (days.length - 1)][0];
  });

  const scrollDates = xCountArray.map((val) => {
    return (day + val) % (getDaysOfMonth(year, month) + 1);
  });
  return { scrollWeekdayLetters, scrollDates };
};
