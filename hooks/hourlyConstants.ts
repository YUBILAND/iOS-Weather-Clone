import { WeatherData } from "@/constants/constants";
import {
  getCurrentHour,
  militaryHour,
  removeZeroFromTimeString,
  stringToTime,
  timeFormat,
} from "./hooks";

export function dateStringToTime(
  dateString: string,
  removeMinutes: boolean,
  americanTime: boolean
) {
  return removeZeroFromTimeString(
    new Date(dateString).toLocaleTimeString(
      "en-US",
      timeFormat(americanTime, removeMinutes)
    )
  );
}

export function addWhiteSpace(weatherString: string) {
  if (weatherString[weatherString.length - 1] !== " ") {
    return weatherString + " ";
  }
  return weatherString;
}
