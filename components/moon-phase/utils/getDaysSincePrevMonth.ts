import { getDaysOfMonth } from "@/hooks/hooks";

export const getDaysSincePrevMonth = (dateObject: Date = new Date()) => {
  const prevMonth = new Date().getMonth() - 1;
  const currentMonth = dateObject.getUTCMonth();

  const isPrevMonth = currentMonth === prevMonth;
  const isMiddleMonth = currentMonth === prevMonth + 1;

  //Since prev month starts on 1st day, you don't count it on the scroll bar
  const additionalDaysInPrevMonth = getDaysOfMonth(2025, prevMonth + 1) - 1;
  const daysInMiddleMonth = getDaysOfMonth(2025, prevMonth + 2);

  const dateInTimeZone = dateObject.toLocaleDateString("en-US", {
    timeZone: "Asia/Tokyo",
  });

  const currentDay = dateInTimeZone.split("/")[1];
  // console.log("days is", daysSincePrevMonth);

  const daysSincePrevMonth = isPrevMonth
    ? parseInt(currentDay) - 1
    : isMiddleMonth
    ? additionalDaysInPrevMonth + parseInt(currentDay)
    : additionalDaysInPrevMonth + daysInMiddleMonth + parseInt(currentDay);
  console.log(daysSincePrevMonth);
  console.log(additionalDaysInPrevMonth + daysInMiddleMonth);

  return daysSincePrevMonth;
};
