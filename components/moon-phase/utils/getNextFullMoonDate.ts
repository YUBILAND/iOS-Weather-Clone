import { WeatherData } from "@/constants/constants";
import { dateDiffInDays } from "./dateDiffinDays";

export const getTimeUntilNextFullMoonDate = (data: WeatherData) => {
  const currentDateUTC = new Date();
  const currentLocalDateString = currentDateUTC.toLocaleString("en-US", {
    timeZone: data.location.tz_id,
  });

  //   Month is zero indexed so +1, recent full moon date is 2/12/25
  const recentFullMoonDate = new Date(2025, 1, 12);
  const currentLocalDateStringSplit = currentLocalDateString.split(",")[0];
  const currentLocalDate = new Date(
    parseInt(currentLocalDateStringSplit.split("/")[2]),
    parseInt(currentLocalDateStringSplit.split("/")[0]) - 1,
    parseInt(currentLocalDateStringSplit.split("/")[1])
  );
  let daysSincePrevFullMoon = dateDiffInDays(
    recentFullMoonDate,
    currentLocalDate
  );

  let prevFullMoonTime = new Date();
  prevFullMoonTime.setUTCHours(13, 53, 0, 0);

  let timeDiff = prevFullMoonTime.valueOf() - currentDateUTC.valueOf();

  const timeDiffInMinutes = timeDiff / (1000 * 60);
  const timeDiffInHours = timeDiff / (1000 * 60 * 60);
  const timeDiffInDays = timeDiff / (1000 * 60 * 60 * 24);

  let timeInDaysSincePrevFullMoon = 0;

  if (prevFullMoonTime > currentDateUTC) {
    // subtract a day
    daysSincePrevFullMoon -= 1;
    timeInDaysSincePrevFullMoon = 1 - timeDiffInDays;
  } else {
    timeInDaysSincePrevFullMoon = timeDiffInDays;
  }

  const elapsedDaysSincePrevFullMoon =
    daysSincePrevFullMoon + timeInDaysSincePrevFullMoon;

  const moonCyclePeriodInDays = 29.53;

  const daysUntilFullMoon =
    moonCyclePeriodInDays -
    (elapsedDaysSincePrevFullMoon % moonCyclePeriodInDays);

  return daysUntilFullMoon;
};
