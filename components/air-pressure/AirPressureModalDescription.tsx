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

interface AirPressureModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const AirPressureModalDescription = ({
  data,
  currentIndex,
}: AirPressureModalDescriptionProps) => {
  const dailyOverviewMessage = "random message";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Overview">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>

      <ModalTextBox title="About Air Pressure">
        <DefaultText>
          Atmospheric pressure, also known as air pressure or barometric
          pressure, is the pressure within the atmosphere of Earth. The standard
          atmosphere is a unit of pressure defined as 101,325 Pa, which is
          equivalent to 1,013.25 millibars, 760 mm Hg, 29.9212 inches Hg, or
          14.696 psi.
        </DefaultText>
      </ModalTextBox>

      <ModalOption title={"Option"} />
    </View>
  );
};

export default AirPressureModalDescription;
