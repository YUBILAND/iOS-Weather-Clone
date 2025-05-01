import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import ComparisonComponent from "../modal/ComparisonComponent";
import ModalTextBox from "../modal/ModalTextBox";
import TempOption from "../modal/TempOption";
import { getDailyComparisonArr } from "../modal/utils/getDailyComparisonArr";
import { getWeekArr } from "../utils/getWeekArr";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import DescriptionText from "../modal/DescriptionText";

interface WindChillModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const WindChillModalDescription = ({
  data,
  currentIndex,
}: WindChillModalDescriptionProps) => {
  const { arrMax: weekHigh, arrMin: weekLow } = getMinMaxArr(
    getWeekArr(data, "windchill_c")
  );

  const dailyComparisonArr = getDailyComparisonArr(data, "windchill_c");

  const summaryText = "random message";
  const dailyComparison = `Today is colder than tomorrow`;
  const feelLikeText = `Wind chill is the sensation of cold produced by the wind for a given ambient air temperature on exposed skin as the air motion accelerates the rate of heat transfer from the body to the surrounding atmosphere.`;

  return (
    <View className="px-4">
      <ModalTextBox title="Daily Summary">
        <DescriptionText>{summaryText}</DescriptionText>
      </ModalTextBox>

      {currentIndex === 0 && (
        <>
          <ModalTextBox title="Daily Comparison" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DescriptionText>{dailyComparison}</DescriptionText>
            </View>

            <HorizontalLine />

            <ComparisonComponent
              rangeHigh={weekHigh}
              rangeLow={weekLow}
              arr={dailyComparisonArr}
            />
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title="About the Feels Like Temperature">
        <DescriptionText>{feelLikeText}</DescriptionText>
      </ModalTextBox>

      <ModalTextBox title="Option">
        <TempOption />
      </ModalTextBox>
    </View>
  );
};

export default WindChillModalDescription;
