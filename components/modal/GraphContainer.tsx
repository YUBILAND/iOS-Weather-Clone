import { colors } from "@/assets/colors/colors";
import { RootState } from "@/state/store";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import Animated, {
  AnimatedProps,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { ChartPressState } from "victory-native";
import { getConditionArray } from "./utils/getConditionArray";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useIs12Hr } from "@/hooks/useIs12Hr";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface GraphContainerProps<Key extends string> {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: Record<
      "currentLineTop" | "currentLineBottom" | "currentPosition" | Key,
      number
    > & {
      secondLine?: number;
    };
  }>;
  isActive: boolean;
  leftSide: React.ReactNode;
  children: React.ReactNode;
  hackyWeatherImage?: boolean;
  scrollInfoBold:
    | Partial<AnimatedProps<TextInputProps>>
    | Partial<AnimatedProps<TextInputProps>>[];
  smallBold?: boolean;
  currentIndex: number;
}

const GraphContainer = <Key extends string>({
  cityName,
  state,
  isActive,
  leftSide,
  children,
  hackyWeatherImage = false,
  scrollInfoBold,
  smallBold = false,
  currentIndex,
}: GraphContainerProps<Key>) => {
  const data = useWeatherData();
  const is12Hr = useIs12Hr();

  // Dynamically show time
  const draggedTime = useAnimatedProps(() => {
    const time = is12Hr
      ? `${
          state.x.value.value === 0 || state.x.value.value === 12
            ? 12
            : state.x.value.value === 24
            ? 12
            : state.x.value.value % 12
        }:00 ${
          state.x.value.value === 24
            ? "AM"
            : Math.floor(state.x.value.value / 12) === 0
            ? "AM"
            : "PM"
        }`
      : `${state.x.value.value % 24}:00`;
    return {
      text: time,
      value: time,
    };
  });

  const stopLeftScrollOnXValue = 4;

  //Translate X so time follows user drag
  const draggedTimeStyle = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;
    return {
      transform: [
        { translateX: xValue < stopLeftScrollOnXValue ? 30 : xPosition },
      ], // Translate X based on state.x
    };
  });

  // Translate X so bold text follows user drag, same as above but for bigger text
  const animatedView = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;

    return {
      transform: [
        {
          translateX:
            xValue < stopLeftScrollOnXValue
              ? hackyWeatherImage
                ? 10
                : -20
              : hackyWeatherImage
              ? xPosition - 10 - 20
              : xPosition - 40,
        },
      ],
    };
  });

  const conditionArray = getConditionArray(data[cityName], currentIndex);

  return (
    <View className=" w-full px-4 relative z-0 pt-20 ">
      <View className="absolute top-0 left-0">
        {/* Draggable Time */}
        <View
          style={{
            opacity: isActive ? 100 : 0,
            position: "absolute",
          }}
        >
          {/* Shows user hovered time */}
          <AnimatedTextInput
            textAlign={"center"}
            editable={false}
            underlineColorAndroid={"transparent"}
            style={[
              {
                fontSize: 14,
                width: 100,
                color: colors.lightGray,
                marginLeft: -35,
              },
              draggedTimeStyle,
            ]}
            animatedProps={draggedTime}
          />

          {/* Shows user hovered weather image and temperature */}
          <AnimatedView
            style={[animatedView]}
            className="flex-row items-center "
          >
            {hackyWeatherImage && (
              <>
                {/* Overlay all images in same spot but toggle opacity based on user dragged line */}
                {conditionArray.map((val, index) => (
                  <AnimatedImage
                    key={index}
                    className={"absolute top-0 left-0 "}
                    style={[
                      ,
                      { width: 35, height: 35 },
                      useAnimatedStyle(() => ({
                        opacity: state.x.value.value === index ? 100 : 0,
                      })),
                    ]}
                    animatedProps={useAnimatedProps(() => ({
                      source: val as ImageSourcePropType,
                    }))}
                  />
                ))}
              </>
            )}

            <AnimatedTextInput
              textAlign={hackyWeatherImage ? undefined : "center"}
              editable={false}
              underlineColorAndroid={"transparent"}
              style={[
                {
                  fontSize: smallBold ? 20 : 25,
                  color: "white",
                  width: 200,
                  // backgroundColor: colors.bgWhite(0.2),
                  marginLeft: hackyWeatherImage ? 40 : -40,
                  fontWeight: 600,
                },
              ]}
              animatedProps={
                Array.isArray(scrollInfoBold)
                  ? scrollInfoBold[0]
                  : scrollInfoBold
              }
            />
          </AnimatedView>

          {Array.isArray(scrollInfoBold) && (
            <AnimatedTextInput
              textAlign={"center"}
              editable={false}
              underlineColorAndroid={"transparent"}
              style={[
                {
                  fontSize: 12,
                  width: 120,
                  lineHeight: 12,
                  color: colors.lightGray,

                  fontWeight: 600,
                },
                animatedView,
              ]}
              animatedProps={scrollInfoBold[1]}
            />
          )}
        </View>

        {/* Left side  */}
        <View
          style={{
            paddingLeft: 8,
            gap: 2,
            opacity: isActive ? 0 : 100,
            paddingTop: 8,
          }}
        >
          {leftSide}
        </View>
      </View>

      <View
        className="pr-4"
        style={{
          borderWidth: 1,
          borderColor: colors.mediumGray,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default GraphContainer;
