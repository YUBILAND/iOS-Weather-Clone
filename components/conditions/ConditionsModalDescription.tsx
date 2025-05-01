import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import HorizontalLine from "../atoms/HorizontalLine";
import ComparisonComponent from "../modal/ComparisonComponent";
import ModalTextBox from "../modal/ModalTextBox";
import TempOption from "../modal/TempOption";
import { getDailyComparisonArr } from "../modal/utils/getDailyComparisonArr";
import { getWeekArr } from "../utils/getWeekArr";
import PrecipitationDotTable, { DotTableEntry } from "./PrecipitationDotTable";
import { get24HrRainfall } from "./utils/get24HrRainfall";
import { getCurrentDayData } from "./utils/getCurrentDayData";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import DescriptionText from "../modal/DescriptionText";

interface ConditionsModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const ConditionsModalDescription = ({
  data,
  currentIndex,
}: ConditionsModalDescriptionProps) => {
  const { last24HrRainfall, next24HrRainfall } = get24HrRainfall(data);

  const dailyTotalRainfall =
    data.forecast.forecastday[currentIndex].day.totalprecip_in;

  const { arrMax: weekTempHigh, arrMin: weekTempLow } = getMinMaxArr(
    getWeekArr(data, "temp_c")
  );

  const currentDayData = getCurrentDayData(last24HrRainfall, next24HrRainfall);

  const dailyPrecip: DotTableEntry[] = [
    {
      variable: "Rain",
      value: dailyTotalRainfall.toString() + '"',
      dot: colors.blue,
    },
  ];

  const dailyComparisonArr = getDailyComparisonArr(data, "temp_c");

  const forecastText = `It is currently 10 and cloudy. It is sunny from 8 to 10. At 4 pm it will become sunny. Today's temperature range from 8-20.`;
  const dailySummaryText = `Monday's lowest temperature is 2 at midnight. Highest temp is 13 at midnight`;
  const dailyComparisonText = `Today is hotter than tomorrow`;

  const firstIndex = currentIndex === 0;
  return (
    <>
      <View className="px-4">
        {firstIndex ? (
          <>
            <ModalTextBox title={"Precipitation Totals"}>
              <PrecipitationDotTable entryArr={currentDayData} />
            </ModalTextBox>

            <ModalTextBox title={"Forecast"}>
              <DescriptionText>{forecastText}</DescriptionText>
            </ModalTextBox>

            <ModalTextBox title="Daily Comparison" removeHorizontalPadding>
              <View className="gap-y-2 px-4">
                <DescriptionText>{dailyComparisonText}</DescriptionText>
              </View>

              <HorizontalLine />

              <ComparisonComponent
                rangeHigh={weekTempHigh}
                rangeLow={weekTempLow}
                arr={dailyComparisonArr}
              />
            </ModalTextBox>
          </>
        ) : (
          <>
            <ModalTextBox title={"Precipitation Total"}>
              <PrecipitationDotTable entryArr={dailyPrecip} />
            </ModalTextBox>

            <ModalTextBox title="Daily Summary">
              <DescriptionText>{dailySummaryText}</DescriptionText>
            </ModalTextBox>
          </>
        )}

        <ModalTextBox title={"Option"}>
          <TempOption />
        </ModalTextBox>
      </View>
    </>
  );
};

export default ConditionsModalDescription;
