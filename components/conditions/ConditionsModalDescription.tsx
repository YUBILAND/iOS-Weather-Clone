import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import ModalBoxTitle from "../modal/ModalBoxTitle";
import ModalTextBoxContainer from "../modal/ModalTextBoxContainer";
import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import Dot from "../modal/Dot";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import ModalTextBox from "../modal/ModalTextBox";
import ModalOption from "../modal/ModalOption";
import RoundedTemperature from "../atoms/RoundedTemperature";
import ProgressBar from "../progress-bar/ProgressBar";
import { getDailyTempArr } from "../daily-forecast/utils/getDailyTempArr";
import { getWeekTempArr } from "../daily-forecast/utils/getWeekTempArr";
import TemperatureBar from "./TemperatureBar";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { getCurrentHour, getCurrentTime, militaryHour } from "@/hooks/hooks";
import { removeZeroFromDecimal } from "./utils/removeZeroFromDecimal";
import PrecipitationDotTable, { DotTableEntry } from "./PrecipitationDotTable";

interface ModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const ModalDescription = ({ data, currentIndex }: ModalDescriptionProps) => {
  const currentHour = getCurrentHour(data.location.tz_id);

  const last24HrRainfall = data.forecast.forecastday[0].hour.reduce(
    (acc, hour, index) => {
      if (index <= currentHour) {
        return (acc += hour.precip_in);
      }
      return acc;
    },
    0
  );

  let next24HrRainfall = data.forecast.forecastday[0].hour.reduce(
    (acc, hour, index) => {
      if (index >= currentHour) {
        return (acc += hour.precip_in);
      }
      return acc;
    },
    0
  );

  next24HrRainfall = data.forecast.forecastday[1].hour.reduce(
    (acc, hour, index) => {
      if (index <= currentHour) {
        return (acc += hour.precip_in);
      }
      return acc;
    },
    0
  );

  const dailyTotalRainfall =
    data.forecast.forecastday[currentIndex].day.totalprecip_in;

  const todaysTempArr = getDailyTempArr(data, 0);
  const todaysHigh = Math.max(...todaysTempArr);
  const todaysLow = Math.min(...todaysTempArr);

  const tomorrowsTempArr = getDailyTempArr(data, 1);
  const tomorrowsHigh = Math.max(...tomorrowsTempArr);
  const tomorrowsLow = Math.min(...tomorrowsTempArr);

  const weekTempArr = getWeekTempArr(data);
  const weekHigh = Math.max(...weekTempArr);
  const weekLow = Math.min(...weekTempArr);

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

  const dailyPrecip: DotTableEntry[] = [
    {
      variable: "Rain",
      value: dailyTotalRainfall.toString() + '"',
      dot: colors.blue,
    },
  ];

  const forecastText = `It is currently 10 and cloudy. It is sunny from 8 to 10. At 4 pm it will become sunny. Today's temperature range from 8-20.`;

  return (
    <View className="px-4">
      <ModalTextBox
        title={
          currentIndex === 0 ? "Precipitation Totals" : "Precipitation Total"
        }
      >
        {currentIndex === 0 ? (
          // Current Date
          <>
            <PrecipitationDotTable entryArr={currentDayData} />
          </>
        ) : (
          // Non-current Date
          <>
            <PrecipitationDotTable entryArr={dailyPrecip} />
          </>
        )}
      </ModalTextBox>

      {currentIndex === 0 ? (
        <>
          <ModalTextBox title={"Forecast"}>
            <DefaultText>{forecastText}</DefaultText>
          </ModalTextBox>

          <ModalTextBox title="Daily Comparison" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>Today is hotter than tomorrow</DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <View className="flex-row justify-between">
                <DefaultText className=" font-semibold">Today</DefaultText>

                <TemperatureBar
                  barWidth={160}
                  weekHigh={weekHigh}
                  weekLow={weekLow}
                  tempHigh={todaysHigh}
                  tempLow={todaysLow}
                  currentTemperature={parseFloat(data.current.temp_c)}
                />
              </View>

              <View className="flex-row justify-between">
                <DefaultText className=" font-semibold">Tomorrow</DefaultText>
                <TemperatureBar
                  barWidth={160}
                  weekHigh={weekHigh}
                  weekLow={weekLow}
                  tempHigh={tomorrowsHigh}
                  tempLow={tomorrowsLow}
                />
              </View>
            </View>
          </ModalTextBox>
        </>
      ) : (
        <ModalTextBox title="Daily Overview">
          <DefaultText>
            Monday's lowest temperature is 2 at midnight. Highest temp is 13 at
            midnight
          </DefaultText>
        </ModalTextBox>
      )}

      <ModalOption title={"Option"} />
    </View>
  );
};

export default ModalDescription;
