import { colors } from "@/assets/colors/colors";
import React, { MutableRefObject } from "react";
import { View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import cloudyImage from "../../assets/images/cloudy.png";
import DefaultText from "../atoms/DefaultText";
import { LeftTextType } from "../modal/Modal";
import { SelectModal } from "../modal/utils/modalConstants";

interface GraphLeftTextProps {
  id: number;
  leftTextShared: MutableRefObject<SharedValue<LeftTextType[]>>;
  selectedModal: SelectModal;
  leftText: LeftTextType[];
}

const GraphLeftText = ({
  id,
  leftTextShared,
  selectedModal,
  leftText,
}: GraphLeftTextProps) => {
  const animatedImage = useAnimatedProps(() => {
    const imageSource = {
      cloudy: cloudyImage,
    };
    const topTextImage = leftTextShared.current.value[id].image;
    console.log(topTextImage === "cloudy");

    return {
      source: imageSource["cloudy"],
    };
  });

  return (
    <View className="">
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 0,
        }}
      >
        <DefaultText style={{ fontSize: 30 }}>
          {leftText[id].topText}
        </DefaultText>
        {leftText[id].topTextSmall && (
          <DefaultText style={{ fontSize: 25, lineHeight: 33 }}>
            {leftText[id].topTextSmall}
          </DefaultText>
        )}
        <DefaultText style={{ fontSize: 30, color: colors.lightGray }}>
          {" "}
          {leftText[id].topTextGray}
        </DefaultText>
        {id === 0 && selectedModal === "conditions" && (
          <Animated.Image
            style={{ width: 35, height: 35 }}
            animatedProps={animatedImage}
          />
        )}
      </View>

      <DefaultText style={{ fontSize: 14, color: colors.lightGray }}>
        {leftText[id].bottomText}
      </DefaultText>
    </View>
  );
};

export default GraphLeftText;
