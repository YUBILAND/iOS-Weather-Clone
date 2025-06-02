import { colors } from "@/assets/colors/colors";
import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import DefaultText from "../atoms/DefaultText";
import { LeftTextType } from "../modal/Modal";
import { SelectModal } from "../modal/utils/modalConstants";

interface GraphLeftTextProps {
  id: number;
  selectedModal: SelectModal;
  leftText: LeftTextType[];
}

const GraphLeftText = ({ id, selectedModal, leftText }: GraphLeftTextProps) => {
  const { topText, topTextSmall, topTextGray, image, bottomText } =
    leftText[id];
  const showImage = id === 0 && selectedModal === "conditions" && image;
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 0,
        }}
      >
        <DefaultText style={{ fontSize: 30 }}>{topText}</DefaultText>
        {topTextSmall && (
          <DefaultText style={{ fontSize: 25, lineHeight: 33 }}>
            {topTextSmall}
          </DefaultText>
        )}
        <DefaultText style={{ fontSize: 30, color: colors.lightGray }}>
          {topTextGray}
        </DefaultText>
        {showImage && image !== null && (
          <Animated.Image style={{ width: 35, height: 35 }} source={image} />
        )}
      </View>

      <DefaultText style={{ fontSize: 14, color: colors.lightGray }}>
        {bottomText}
      </DefaultText>
    </View>
  );
};

export default GraphLeftText;
