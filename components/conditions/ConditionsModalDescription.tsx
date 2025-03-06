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

interface ModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const ModalDescription = ({ data, currentIndex }: ModalDescriptionProps) => {
  const rainFallTomorrowArr = data.forecast.forecastday[1].hour.map(
    (hour) => hour.precip_in
  );

  const maxRainfallTomorrow = Math.max(...rainFallTomorrowArr);

  const dailyTotalRainfall =
    data.forecast.forecastday[currentIndex].day.totalprecip_in;

  const weekTempArr = getWeekTempArr(data);
  const weekHigh = Math.max(...weekTempArr);
  const weekLow = Math.min(...weekTempArr);

  const todaysTempArr = getDailyTempArr(data, 0);
  const todaysHigh = Math.max(...todaysTempArr);
  const todaysLow = Math.min(...todaysTempArr);

  const tomorrowsTempArr = getDailyTempArr(data, 1);
  const tomorrowsHigh = Math.max(...tomorrowsTempArr);
  const tomorrowsLow = Math.min(...tomorrowsTempArr);
  parseInt(data.current?.temp_c!);
  return (
    <View className="px-4">
      <ModalTextBox title="Total Precipitation">
        {currentIndex === 0 ? (
          <>
            <View className="gap-y-2">
              <DefaultText style={{ color: colors.lightGray }}>
                Last 24 hours
              </DefaultText>
              <View className="flex-row justify-between">
                <DefaultText className="font-semibold">
                  Precipitation
                </DefaultText>
                <DefaultText className="font-semibold" style={{ fontSize: 16 }}>
                  0"
                </DefaultText>
              </View>
            </View>

            <HorizontalLine />

            <View className="gap-y-2">
              <DefaultText style={{ color: colors.lightGray }}>
                Next 24 hours
              </DefaultText>
              <View className="flex-row justify-between ">
                <View className="flex-row items-center gap-x-2">
                  <Dot color={colors.blue} />
                  <DefaultText className="font-semibold">Rain</DefaultText>
                </View>
                <DefaultText
                  className="font-semibold"
                  style={{ color: colors.blue, fontSize: 16 }}
                >
                  {maxRainfallTomorrow}"
                </DefaultText>
              </View>
            </View>
          </>
        ) : (
          <View className="gap-y-2">
            <View className="flex-row justify-between ">
              <View className="flex-row items-center gap-x-2">
                <Dot color={colors.blue} />
                <DefaultText className="font-semibold">Rain</DefaultText>
              </View>

              <DefaultText
                className="font-semibold"
                style={{ color: colors.blue, fontSize: 16 }}
              >
                {dailyTotalRainfall}"
              </DefaultText>
            </View>
          </View>
        )}
      </ModalTextBox>

      {currentIndex === 0 ? (
        <>
          <ModalTextBox title={"Forecast"}>
            <DefaultText>
              It is currently 10 and cloudy. It is sunny from 8 to 10. At 4 pm
              it will become sunny. Today's temperature range from 8-20.
            </DefaultText>
          </ModalTextBox>

          <ModalTextBox title="Compared to yesterday" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>Today is hotter than yesterday</DefaultText>
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
                <DefaultText className=" font-semibold">Yesterday</DefaultText>
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
