import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import ModalTextBox from "../modal/ModalTextBox";
// import { getUVArr } from "./utils/getUVArr";

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
