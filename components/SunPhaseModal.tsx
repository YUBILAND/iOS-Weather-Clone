import {
  View,
  Text,
  Image,
  Modal,
  SafeAreaView,
  TextInput,
} from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import CalendarScrollView from "./CalendarScrollView";
import { useChartPressState } from "victory-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import SpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import SunPhaseTest from "./SunPhaseGraph";
import SunPhaseGraph from "./SunPhaseGraph";
import OpacityCard from "./OpacityCard";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import DefaultText from "./DefaultText";

Animated.addWhitelistedNativeProps({ value: true, source: true });

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type SunPhaseModalProps = {
  cityName: string;
  nextPhaseTime: string;
};

const SunPhaseModal = ({ cityName, nextPhaseTime }: SunPhaseModalProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { sunPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const animatedHour = useAnimatedProps(() => {
    const hourConversion = Math.floor((state.x.value.value * 60) / 60);
    const minuteConversion: number =
      (Math.round(state.x.value.value * 60 * 100) / 100) % 60;
    const hours =
      hourConversion.toString() +
      ":" +
      (minuteConversion < 10
        ? "0" + minuteConversion.toString()
        : minuteConversion.toString());

    const hour = hours;
    return {
      text: hour,
      value: hour,
    };
  });

  const animatedRange = useAnimatedProps(() => {
    const range = `${state.y.sunPath.value.value}`;
    return {
      text: range,
      value: range,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: state.x.position.value - 20 }], // Translate X based on state.x
    };
  });
  return (
    <View>
      {/* <View className="flex-row text-4xl gap-x-4">
        <AnimatedTextInput
          editable={false}
          underlineColorAndroid={"transparent"}
          style={[
            {
              fontSize: 18,
              color: "white",
              width: 100,
            },
          ]}
          animatedProps={animatedHour}
        />

        <AnimatedTextInput
          editable={false}
          underlineColorAndroid={"transparent"}
          style={[
            {
              fontSize: 18,
              color: "white",
            },
          ]}
          animatedProps={animatedRange}
        />
      </View> */}

      <View>
        <View className="px-4 gap-y-3 py-3 relative">
          <DefaultText
            className="text-3xl uppercase font-semibold"
            style={{ opacity: isActive ? 0 : 100 }}
          >
            {nextPhaseTime}
          </DefaultText>

          <View
            className="absolute top-0 left-0"
            style={{ opacity: isActive ? 100 : 0 }}
          >
            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={"transparent"}
              style={[
                {
                  fontSize: 18,
                  color: "white",
                  width: 100,
                },
                animatedStyle,
              ]}
              animatedProps={animatedHour}
            />
          </View>
        </View>

        <SunPhaseGraph
          cityName={cityName}
          state={state}
          isActive={isActive}
          graphHeight={400}
          strokeWidth={6}
          addBackground
          addLines
        />

        <DefaultText className="px-4 text-base">Sunset: 2 hours</DefaultText>
      </View>
    </View>
  );
};

export default SunPhaseModal;
