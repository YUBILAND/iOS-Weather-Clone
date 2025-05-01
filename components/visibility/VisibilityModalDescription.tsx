import { WeatherData } from "@/constants/constants";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import BarComparison from "../modal/BarComparison";
import DistanceOption from "../modal/DistanceOption";
import ModalTextBox from "../modal/ModalTextBox";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";

interface VisibilityModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const VisibilityModalDescription = ({
  data,
  currentIndex,
}: VisibilityModalDescriptionProps) => {
  const distanceUnit = useOtherUnits()["distance"];

  const { arrMax: todaysHigh } = getMinMaxArr(getDayArr(data, 0, "vis_miles"));
  const { arrMax: tomorrowsHigh } = getMinMaxArr(
    getDayArr(data, 1, "vis_miles")
  );

  const dailySummaryMessage = "random message";
  const dailyComparisonText = `Today's UV index is similar to yesterdays`;
  const visibilityText = `In weather terms, "visibility" refers to the distance at which an object or light can be clearly seen and identified, essentially measuring how far you can see clearly depending on the atmospheric conditions, like fog, haze, or precipitation, which can significantly impact visibility levels; low visibility means you can see only a short distance, while high visibility indicates clear conditions with a long viewing range.`;

  const firstIndex = currentIndex === 0;
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Summary">
        <DefaultText>{dailySummaryMessage}</DefaultText>
      </ModalTextBox>

      {firstIndex && (
        <>
          <ModalTextBox title="Daily Comparison" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>{dailyComparisonText}</DefaultText>
            </View>

            <HorizontalLine />

            <BarComparison
              todaysHigh={Math.round(todaysHigh)}
              tomorrowsHigh={Math.round(tomorrowsHigh)}
              unit={distanceUnit}
            />
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title="About Visibility">
        <DefaultText>{visibilityText}</DefaultText>
      </ModalTextBox>

      <ModalTextBox title={"Option"}>
        <DistanceOption />
      </ModalTextBox>
    </View>
  );
};

export default VisibilityModalDescription;
