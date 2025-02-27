import { View, Text, Dimensions, TextInput } from "react-native";
import React from "react";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ChartPressState } from "victory-native";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface SunPhaseDraggableTimeProps {
  state: ChartPressState<{
    x: number;
    y: {
      sunPath: number;
      sunPosition: number;
      phaseLine: number;
    };
  }>;
  isActive: boolean;
  americanTime: boolean;
}
const SunPhaseDraggableTime = ({
  americanTime,
  state,
  isActive,
}: SunPhaseDraggableTimeProps) => {
  const { width } = Dimensions.get("screen");

  const animatedHour = useAnimatedProps(() => {
    const hourConversion = Math.floor((state.x.value.value * 60) / 60);
    const minuteConversion: number =
      (Math.round(state.x.value.value * 60 * 100) / 100) % 60;
    const hours =
      (hourConversion % 24).toString() +
      ":" +
      (minuteConversion < 10
        ? "0" + minuteConversion.toString()
        : minuteConversion.toString());

    const time = americanTime
      ? (parseInt(hours.split(":")[0]) % 13) +
        ":" +
        hours.split(":")[1].split(" ")[0] +
        (parseInt(hours.split(":")[0]) >= 12 ? " PM" : " AM")
      : hours;
    return {
      text: time,
      value: time,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;

    const stopRight = americanTime ? 18 : 20;

    return {
      transform: [
        {
          translateX:
            xValue < 3
              ? (3 / 24) * width - 40
              : xValue > stopRight
              ? ((stopRight - 2) / 24) * width - 30
              : xPosition - 40,
        },
      ], // Translate X based on state.x
    };
  });
  return (
    <View
      className="absolute top-10 left-0"
      style={{ opacity: isActive ? 100 : 0 }}
    >
      <AnimatedTextInput
        editable={false}
        underlineColorAndroid={"transparent"}
        style={[
          {
            fontSize: 32,
            color: "white",
            width: americanTime ? 150 : 100,
            fontWeight: 800,
          },
          animatedStyle,
        ]}
        animatedProps={animatedHour}
      />
    </View>
  );
};

export default SunPhaseDraggableTime;
