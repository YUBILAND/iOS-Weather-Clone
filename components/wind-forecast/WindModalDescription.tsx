import React from "react";
import { View, Text } from "react-native";
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
import ModalTransparentTextBox from "../modal/ModalTransparentTextBox";
// import { getUVArr } from "./utils/getUVArr";
import HorizontalBar from "../uv-index/HorizontalBar";
import { getUVArr } from "../uv-index/utils/getUVArr";
import { getWindArr } from "./utils/getWindArr";
import { ListItem } from "tamagui";
import BeaufortScale from "./BeaufortScale";

interface WindModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const WindModalDescription = ({
  data,
  currentIndex,
}: WindModalDescriptionProps) => {
  const todaysWindArr = getWindArr(data, 0);
  const todaysWindHigh = Math.round(Math.max(...todaysWindArr));

  const tomorrowsWindArr = getWindArr(data, 1);
  const tomorrowsWindHigh = Math.round(Math.max(...tomorrowsWindArr));

  const maxWind = Math.max(
    Math.round(todaysWindHigh),
    Math.round(tomorrowsWindHigh)
  );

  const dailyOverviewMessage = "Current wind speed is coming from the";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Overview">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>
      {currentIndex === 0 && (
        <>
          <ModalTextBox title="Compared to yesterday" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>
                Today's UV index is similar to yesterdays
              </DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <HorizontalBar
                title="Today"
                bgColor="light"
                currentHigh={Math.round(todaysWindHigh).toString() + " mph"}
                percentage={todaysWindHigh / maxWind}
              />
              <HorizontalBar
                title="Tomorrow"
                bgColor="dark"
                currentHigh={Math.round(tomorrowsWindHigh).toString() + " mph"}
                percentage={tomorrowsWindHigh / maxWind}
              />
            </View>
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title={"Wind Information"}>
        <DefaultText>Wind is wind</DefaultText>
      </ModalTextBox>

      <ModalTextBox title={"Beaufort Wind Scale"} removeHorizontalPadding>
        <View className="gap-y-3">
          <BeaufortScale />
        </View>
      </ModalTextBox>

      <ModalTextBox title={"About Beaufort Wind Scale"}>
        <DefaultText
          className=""
          style={{ lineHeight: 18, letterSpacing: 0.2 }}
        >
          The Beaufort scale is a wind force scale that uses numbers to describe
          wind speed and conditions. It was developed by Sir Francis Beaufort of
          the U.K. Royal Navy in 1805.
        </DefaultText>
      </ModalTextBox>

      <ModalOption title="Option" />
    </View>
  );
};

export default WindModalDescription;
