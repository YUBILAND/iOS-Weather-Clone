import { colors } from "@/assets/colors/colors";
import { DotTableEntry } from "../PrecipitationDotTable";
import { removeZeroFromDecimal } from "./removeZeroFromDecimal";

export const getCurrentDayData = (
  last24HrRainfall: number,
  next24HrRainfall: number
) => {
  const currentDayData: DotTableEntry[] = [
    {
      header: "Last 24 hours",
      variable: "Precipitation",
      value:
        removeZeroFromDecimal(
          (Math.round(last24HrRainfall * 100) / 100).toString()
        ) + '"',
    },

    {
      header: "Next 24 hours",
      variable: "Rain",
      value:
        removeZeroFromDecimal(
          (Math.round(next24HrRainfall * 100) / 100).toString()
        ) + '"',
      dot: colors.blue,
    },
  ];

  return currentDayData;
};
