import { SharedValue } from "react-native-reanimated";
import { ChartPressStateType } from "../graphs/utils/constants";
import { useWeatherData } from "@/hooks/useWeatherData";
import { getWeatherName, weatherNameToCardBg } from "@/utils/exampleForecast";

export const getMonthDayDate = (
  xValue: number,
  currentMonth: string,
  currentDay: number,
  prevMonth: string
) => {
  "worklet";
  const lastMonthMaxDays = 30;
  // Last 30 days so we choose 30
  const daysOfHistory = 30;

  const dateNumberDifference = currentDay - (daysOfHistory - xValue);
  const dateNumber =
    dateNumberDifference > 0
      ? dateNumberDifference
      : lastMonthMaxDays + dateNumberDifference;

  const calendarDate =
    (dateNumberDifference > 0 ? currentMonth : prevMonth) + " " + dateNumber;
  return calendarDate;
};

export const getRainScrollValues = (state: ChartPressStateType) => {
  "worklet";
  const xValue = state.x.value.value;
  const blueLine = state.y.mainLine.value.value;
  const grayLine = state.y.secondLine.value.value;

  return { xValue, blueLine, grayLine };
};

export const getDragXY = (state: ChartPressStateType) => {
  "worklet";
  const xValue = state.x.value.value;
  const mainLine = state.y.mainLine.value.value;
  const secondLine = state.y.secondLine.value.value;
  const thirdLine = state.y.thirdLine.value.value;

  return { xValue, mainLine, secondLine, thirdLine };
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const xValueToDraggedTime = (xValue: number) => {
  "worklet";
  return `${
    xValue === 0 || xValue === 12 ? 12 : xValue === 24 ? 12 : xValue % 12
  }:00 ${xValue === 24 ? "AM" : Math.floor(xValue / 12) === 0 ? "AM" : "PM"}`;
};

export const getBackground = (currentCityName: string) => {
  const data = useWeatherData();
  const background = weatherNameToCardBg(
    getWeatherName(data[currentCityName]?.current.condition.code),
    data[currentCityName]?.current.is_day
  );
  return background;
};

export const getArrAverage = (arr: number[]) => {
  return arr.reduce((acc, val) => (acc += val), 0) / arr.length;
};
