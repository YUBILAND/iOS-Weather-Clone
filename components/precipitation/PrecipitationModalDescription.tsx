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

interface PrecipitationModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const PrecipitationModalDescription = ({
  data,
  currentIndex,
}: PrecipitationModalDescriptionProps) => {
  const currentWindChill = data.current.windchill_c;

  const dailyOverviewMessage = "random message";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Overview">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>

      <ModalOption title={"Option"} />
    </View>
  );
};

export default PrecipitationModalDescription;
