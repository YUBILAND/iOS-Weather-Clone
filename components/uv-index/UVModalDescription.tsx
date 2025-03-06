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
import { getUVArr } from "./utils/getUVArr";
import HorizontalBar from "./HorizontalBar";

interface UVModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const UVModalDescription = ({
  data,
  currentIndex,
}: UVModalDescriptionProps) => {
  const todaysUVArr = getUVArr(data, 0);
  const todaysUVHigh = Math.round(Math.max(...todaysUVArr));

  const tomorrowsUVArr = getUVArr(data, 1);
  const tomorrowsUVHigh = Math.round(Math.max(...tomorrowsUVArr));

  const maxUV = Math.max(Math.round(todaysUVHigh), Math.round(tomorrowsUVHigh));

  return (
    <View className="px-4">
      <ModalTransparentTextBox
        title={currentIndex === 0 ? "Currently, 7:24" : "2025, Mar 4th"}
        description="It is currently weak. From 10 to 2, it will become mid level."
      />

      {currentIndex === 0 ? (
        <>
          <ModalTextBox title="Compared to yesterday" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>
                Today's UV index is similtar to yesterdays
              </DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <HorizontalBar
                title="Today"
                bgColor="light"
                currentHigh={Math.round(todaysUVHigh).toString()}
                percentage={todaysUVHigh / maxUV}
              />
              <HorizontalBar
                title="Tomorrow"
                bgColor="dark"
                currentHigh={Math.round(tomorrowsUVHigh).toString()}
                percentage={tomorrowsUVHigh / maxUV}
              />
            </View>
          </ModalTextBox>

          <ModalTextBox title={"UV Information"}>
            <DefaultText>
              It is currently 10 and cloudy. It is sunny from 8 to 10. At 4 pm
              it will become sunny. Today's temperature range from 8-20.
            </DefaultText>
          </ModalTextBox>
        </>
      ) : (
        <>
          <ModalTextBox title={"UV Information"}>
            <DefaultText>
              It is currently 10 and cloudy. It is sunny from 8 to 10. At 4 pm
              it will become sunny. Today's temperature range from 8-20.
            </DefaultText>
          </ModalTextBox>
        </>
      )}
    </View>
  );
};

export default UVModalDescription;
