import { useOtherUnits } from "@/hooks/useOtherUnits";
import { RootState } from "@/state/store";
import React from "react";
import {
  Pressable,
  View,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { EyeIcon } from "react-native-heroicons/outline";
import { Circle } from "react-native-svg";
import { useSelector } from "react-redux";
import CardTitle from "../atoms/CardTitle";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { getPressurePercentage } from "./utils/getPressurePercentage";
import { getPressure } from "@/hooks/useDisplayUnits";
import { getOddPressureDirectionImages } from "./utils/getOddPressureDirectionImages";
import { getCurrentHour, getCurrentTime } from "@/hooks/hooks";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface AirPressureCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
  collapseFromTopStyle: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const AirPressureCard = ({
  cityName,
  showModal,
  iconSize,
  collapseFromTopStyle,
}: AirPressureCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];
  const pressureUnit = useOtherUnits()["pressure"];

  const currentAirPressureNumber =
    pressureUnit === "inHg"
      ? getPressure(current.pressure_in).toFixed(2)
      : Math.round(getPressure(current.pressure_in));

  const { currentAirPressureUnit, percentage, imageArray, currentLineIndex } =
    (() => {
      const currentAirPressureUnit = pressureUnit;
      const percentage = getPressurePercentage(current.pressure_in);
      const imageArray = getOddPressureDirectionImages(
        data[cityName],
        0,
        false
      );
      const currentLineIndex = getCurrentHour(data[cityName].location.tz_id);
      return {
        currentAirPressureUnit,
        percentage,
        imageArray,
        currentLineIndex,
      };
    })();

  const AnimatedCircularProgressProps = {
    rotation: 230,
    arcSweepAngle: 260,
    size: 115,
    style: { marginBottom: -20 },
    width: 8,
    fill: percentage,
    lineCap: "square" as "square" | "butt" | "round" | undefined,
    tintColor: "transparent",
    backgroundColor: "#3d5875",
    padding: 4,
    renderCap: ({
      center: { x, y },
    }: {
      center: {
        x: number;
        y: number;
      };
    }) => <Circle cx={x} cy={y} r={8} fill={"white"} />,
  };

  const InnerText = () => (
    <View className="items-center mb-3">
      <Image
        style={{ width: 30, height: 30 }}
        source={
          imageArray.pressureImgArr[
            Math.floor(currentLineIndex / 2) + 1
          ] as ImageSourcePropType
        }
      />
      <DefaultText style={{ fontSize: 20, fontWeight: 800 }}>
        {currentAirPressureNumber}
      </DefaultText>
      <DefaultText style={{ fontSize: 14 }}>
        {currentAirPressureUnit}
      </DefaultText>
    </View>
  );

  const LowAndHighText = () => {
    return (
      <View className="w-full flex-row justify-around">
        <DefaultText>Low</DefaultText>
        <DefaultText>High</DefaultText>
      </View>
    );
  };

  return (
    <OpacityCard>
      <Pressable className="px-4 gap-y-2 h-full" onPress={showModal}>
        <CardTitle
          title={"Air Pressure"}
          icon={<EyeIcon size={iconSize} color={"white"} />}
        />
        <View className="overflow-hidden">
          <Animated.View style={collapseFromTopStyle}>
            <View className="items-center">
              <AnimatedCircularProgress {...AnimatedCircularProgressProps}>
                {InnerText}
              </AnimatedCircularProgress>
              <LowAndHighText />
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(AirPressureCard);
