import { MoonPhase } from "./constants";

export const moonLuminToPhase = (
  currentMoonPhase: MoonPhase,
  percent: number
) => {
  if (currentMoonPhase === "waxing") {
    if (percent === 0) {
      return "New Moon";
    } else if (percent >= 1 && percent <= 49) {
      return "Waxing Crescent";
    } else if (percent >= 50) {
      return "First Quarter";
    } else if (percent >= 51 && percent <= 99) {
      return "Waxing Gibbous";
    } else if (percent === 100) {
      return "Full Moon";
    }
  } else {
    if (percent === 100) {
      return "Full Moon";
    } else if (percent >= 51 && percent <= 99) {
      return "Waning Gibbous";
    } else if (percent >= 50) {
      return "Last Quarter";
    } else if (percent >= 1 && percent <= 49) {
      return "Waning Crescent";
    } else if (percent === 0) {
      return "New Moon";
    }
  }
};
