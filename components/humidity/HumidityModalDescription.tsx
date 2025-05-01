import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import BarComparison from "../modal/BarComparison";
import ModalOption from "../modal/ModalOption";
import ModalTextBox from "../modal/ModalTextBox";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";

interface HumidityModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const HumidityModalDescription = ({
  data,
  currentIndex,
}: HumidityModalDescriptionProps) => {
  const { arrMax: todaysHigh } = getMinMaxArr(getDayArr(data, 0, "humidity"));
  const { arrMax: tomorrowsHigh } = getMinMaxArr(
    getDayArr(data, 1, "humidity")
  );

  const summaryText = "random message";
  const dailyComparisonText = `Today's Humidity is similar to yesterdays`;
  const relativeHumidityText = `Relative humidity (RH) is the amount of water vapor in the air compared to the maximum amount of water vapor the air can hold at that temperature. It's expressed as a percentage.`;
  const dewpointText = `In science, dew point is the temperature at which air is cooled to its maximum water vapor capacity, or 100% relative humidity. At this point, water vapor in the air condenses into liquid, such as fog or precipitation.`;

  return (
    <View className="px-4">
      <ModalTextBox title="Summary">
        <DefaultText>{summaryText}</DefaultText>
      </ModalTextBox>

      {currentIndex === 0 && (
        <>
          <ModalTextBox title="Daily Comparison" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>{dailyComparisonText}</DefaultText>
            </View>

            <HorizontalLine />

            <BarComparison
              todaysHigh={Math.round(todaysHigh)}
              tomorrowsHigh={Math.round(tomorrowsHigh)}
              unit={"%"}
            />
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title="About Relative Humidity">
        <DefaultText>{relativeHumidityText}</DefaultText>
      </ModalTextBox>

      <ModalTextBox title="About Dewpoint">
        <DefaultText>{dewpointText}</DefaultText>
      </ModalTextBox>
    </View>
  );
};

export default HumidityModalDescription;
