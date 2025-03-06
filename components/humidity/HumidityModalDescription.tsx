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
import HorizontalBar from "../uv-index/HorizontalBar";
import { getWeekVisibilityArr } from "../visibility/utils/getWeekVisibilityArr";
import { getDailyVisibilityArr } from "../visibility/utils/getDailyVisibilityArr";

interface HumidityModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const HumidityModalDescription = ({
  data,
  currentIndex,
}: HumidityModalDescriptionProps) => {
  const weekVisibilitylArr = getWeekVisibilityArr(data, "humidity");
  const weekHigh = Math.max(...weekVisibilitylArr);
  const weekLow = Math.min(...weekVisibilitylArr);

  const todaysVisibilityArr = getDailyVisibilityArr(data, "humidity", 0);
  const todaysHigh = Math.max(...todaysVisibilityArr);
  const todaysLow = Math.min(...todaysVisibilityArr);

  const tomorrowsVisibilityArr = getDailyVisibilityArr(data, "humidity", 1);
  const tomorrowsHigh = Math.max(...tomorrowsVisibilityArr);
  const tomorrowsLow = Math.min(...tomorrowsVisibilityArr);

  const maxHigh = Math.max(todaysHigh, tomorrowsHigh);

  const dailyOverviewMessage = "random message";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Overview">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>

      {currentIndex === 0 && (
        <>
          <ModalTextBox title="Compared to Tomorrow" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>
                Today's Humidity is similar to yesterdays
              </DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <HorizontalBar
                title="Today"
                bgColor="light"
                currentHigh={Math.round(todaysHigh).toString() + "%"}
                percentage={todaysHigh / maxHigh}
              />
              <HorizontalBar
                title="Tomorrow"
                bgColor="dark"
                currentHigh={Math.round(tomorrowsHigh).toString() + "%"}
                percentage={tomorrowsHigh / maxHigh}
              />
            </View>
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title="About Relative Humidity">
        <DefaultText>
          Relative humidity (RH) is the amount of water vapor in the air
          compared to the maximum amount of water vapor the air can hold at that
          temperature. It's expressed as a percentage.
        </DefaultText>
      </ModalTextBox>

      <ModalTextBox title="About Dewpoint">
        <DefaultText>
          In science, dew point is the temperature at which air is cooled to its
          maximum water vapor capacity, or 100% relative humidity. At this
          point, water vapor in the air condenses into liquid, such as fog or
          precipitation.
        </DefaultText>
      </ModalTextBox>

      <ModalOption title={"Option"} />
    </View>
  );
};

export default HumidityModalDescription;
