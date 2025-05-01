import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  SharedValue,
} from "react-native-reanimated";

interface SliderProps {
  onPress1: () => void;
  onPress2: () => void;
  onLayout: any;
  animatedStyles: any;
}
const Slider = ({
  onPress1,
  onPress2,
  onLayout,
  animatedStyles,
}: SliderProps) => {
  return (
    <>
      <View className="relative" onLayout={onLayout}>
        <Animated.View
          className="absolute top-0 left-0 rounded-xl"
          style={[
            {
              backgroundColor: colors.bgWhite(0.4),
              width: "50%",
              height: "100%",
              zIndex: 10,
            },
            animatedStyles,
          ]}
        />
        <View
          style={{
            backgroundColor: colors.mediumGray,
            alignContent: "center",
          }}
          className="flex-row justify-around rounded-lg"
        >
          <Pressable
            onPress={onPress1}
            style={{ width: "50%" }}
            className="py-2 items-center"
          >
            <DefaultText>Temperature</DefaultText>
          </Pressable>
          <Pressable
            onPress={onPress2}
            style={{ width: "50%" }}
            className="py-2 items-center"
          >
            <DefaultText>Precipitation</DefaultText>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default Slider;

{
  /* <View className="relative" onLayout={onLayout}>
              <Animated.View
                className="absolute top-0 left-0 rounded-xl"
                style={[
                  {
                    backgroundColor: colors.bgWhite(0.4),
                    width: "50%",
                    height: "100%",
                    zIndex: 10,
                  },
                  animatedStyles,
                ]}
              />

              <View
                style={{
                  backgroundColor: colors.mediumGray,
                  alignContent: "center",
                }}
                className="flex-row justify-around rounded-lg"
              >
                <Pressable
                  onPress={handleClick1}
                  style={{ width: "50%" }}
                  className="py-2 items-center"
                >
                  <DefaultText>Temperature</DefaultText>
                </Pressable>
                <Pressable
                  onPress={handleClick2}
                  style={{ width: "50%" }}
                  className="py-2 items-center"
                >
                  <DefaultText>Precipitation</DefaultText>
                </Pressable>
              </View>
            </View> */
}

{
  /* <View className="relative" onLayout={onLayout}>
              <Animated.View
                className="absolute top-0 left-0 rounded-xl"
                style={[
                  {
                    backgroundColor: colors.bgWhite(0.4),
                    width: "50%",
                    height: "100%",
                    zIndex: 10,
                  },
                  animatedStyles,
                ]}
              />

              <View
                style={{
                  backgroundColor: colors.mediumGray,
                  alignContent: "center",
                }}
                className="flex-row justify-around rounded-lg"
              >
                <Pressable
                  onPress={handleClick1}
                  style={{ width: "50%" }}
                  className="py-2 items-center"
                >
                  <DefaultText>Temperature</DefaultText>
                </Pressable>
                <Pressable
                  onPress={handleClick2}
                  style={{ width: "50%" }}
                  className="py-2 items-center"
                >
                  <DefaultText>Precipitation</DefaultText>
                </Pressable>
              </View>
            </View> */
}
