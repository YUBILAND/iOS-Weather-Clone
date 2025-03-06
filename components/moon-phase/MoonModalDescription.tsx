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
import { ListItem } from "tamagui";

interface MoonModalDescriptionProps {
  data: WeatherData;
}

const MoonModalDescription = ({ data }: MoonModalDescriptionProps) => {
  return (
    <View className="px-4">
      <ModalTextBox title={"About Moon Illumination"}>
        <DefaultText>Wind is wind</DefaultText>
      </ModalTextBox>

      <ModalTextBox title={"About Distance to the Moon"}>
        <DefaultText
          className=""
          style={{ lineHeight: 18, letterSpacing: 0.2 }}
        >
          Often when we see drawings of the Earth and the Moon, they look really
          close together. Don't be fooled! They're actually really far apart.
          The Moon is an average of 238,855 miles (384,400 km) away.
        </DefaultText>
      </ModalTextBox>
    </View>
  );
};

export default MoonModalDescription;
