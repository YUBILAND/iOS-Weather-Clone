import { getDaysOfMonth } from "@/hooks/hooks";

export const getTicksAmount = () => {
  const prevMonth = new Date().getMonth() - 1;
  const currentMonth = new Date().getMonth();
  const nextMonth = new Date().getMonth() + 1;

  const daysofPrevMonth = getDaysOfMonth(2025, prevMonth - 1);
  const daysofCurrentMonth = getDaysOfMonth(2025, currentMonth - 1);
  const daysofNextMonth = getDaysOfMonth(2025, nextMonth - 1);

  const totalDays = daysofPrevMonth + daysofCurrentMonth + daysofNextMonth;
  const whiteTicks = totalDays;

  const totalTicks = 13 + 12 * (whiteTicks - 2);

  return { whiteTicks, totalTicks };
};
