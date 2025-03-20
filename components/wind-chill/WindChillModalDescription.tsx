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
import TemperatureBar from "../conditions/TemperatureBar";
import { getWeekWindChillArr } from "./utils/getWeekWindChillArr";
import { getDailyWindChillArr } from "./utils/getDailyWindChillArr";

interface WindChillModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const WindChillModalDescription = ({
  data,
  currentIndex,
}: WindChillModalDescriptionProps) => {
  const weekWindChillArr = getWeekWindChillArr(data);
  const weekHigh = Math.max(...weekWindChillArr);
  const weekLow = Math.min(...weekWindChillArr);

  const todaysWindChillArr = getDailyWindChillArr(data, 0);
  const todaysHigh = Math.max(...todaysWindChillArr);
  const todaysLow = Math.min(...todaysWindChillArr);

  const tomorrowsWindChillArr = getDailyWindChillArr(data, 1);
  const tomorrowsHigh = Math.max(...tomorrowsWindChillArr);
  const tomorrowsLow = Math.min(...tomorrowsWindChillArr);

  const currentWindChill = data.current.windchill_c;

  const dailyOverviewMessage = "random message";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Summary">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>

      {currentIndex === 0 && (
        <>
          <ModalTextBox title="Compared to tomorrow" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>Today is colder than tomorrow</DefaultText>
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
                  currentTemperature={currentWindChill}
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
      )}

      <ModalTextBox title="About the Feels Like Temperature">
        <DefaultText>
          Wind chill is the sensation of cold produced by the wind for a given
          ambient air temperature on exposed skin as the air motion accelerates
          the rate of heat transfer from the body to the surrounding atmosphere.
        </DefaultText>
      </ModalTextBox>
      <ModalOption />
    </View>
  );
};

export default WindChillModalDescription;
