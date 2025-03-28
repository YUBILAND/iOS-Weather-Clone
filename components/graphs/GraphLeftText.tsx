import { colors } from "@/assets/colors/colors";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { TextInput, View } from "react-native";
import Animated, {
  measure,
  runOnUI,
  SharedValue,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import cloudyImage from "../../assets/images/cloudy.png";
import { LeftTextType } from "../modal/Modal";
import { usePrevious } from "../moon-phase/utils/usePrevious";
import { SelectModal } from "../modal/utils/modalConstants";
import DefaultText from "../atoms/DefaultText";

interface GraphLeftTextProps {
  id: number;
  leftTextShared: MutableRefObject<SharedValue<LeftTextType[]>>;
  fadeOpacity: SharedValue<number>;
  currentIndexRef: MutableRefObject<number>;
  selectedModal: SelectModal;
  leftText: LeftTextType[];
}
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const GraphLeftText = ({
  id,
  leftTextShared,
  fadeOpacity,
  currentIndexRef,
  selectedModal,
  leftText,
}: GraphLeftTextProps) => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (textRef.current) {
  //       const measured = measure(textRef);
  //       if (measured) {
  //         setTextWidth(measured.width);
  //       }
  //     }
  //   }, 0);
  // }, [leftTextShared.current.value]);

  // console.log("id is", id);
  // const disableOpacity = useMemo(() => {
  //   return (
  //     leftTextShared.current.value[currentIndex].bottomText !==
  //     leftTextShared.current.value[previousValue ?? currentIndex].bottomText
  //   );
  // }, [currentIndex, previousValue, leftTextShared]);

  // const disableOpacityTop = useMemo(() => {
  //   return (
  //     leftTextShared.current.value[currentIndex].topText !==
  //     leftTextShared.current.value[previousValue ?? currentIndex].topText
  //   );
  // }, [currentIndex, previousValue, leftTextShared]);

  // Get the animated text
  // const derivedText = useDerivedValue(() => {
  //   const sharedValue = leftTextShared.current.value;
  //   return sharedValue && sharedValue.length >= 3
  //     ? sharedValue[id].topText
  //     : "No Data";
  // });

  // const derivedTextGray = useDerivedValue(() => {
  //   const sharedValue = leftTextShared.current.value;
  //   return sharedValue && sharedValue.length >= 3
  //     ? sharedValue[id].topTextGray
  //     : "No Data";
  // });

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
      <View>
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
    </View>
  );
};

export default GraphLeftText;
