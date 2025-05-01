import { colors } from "@/assets/colors/colors";
import { getCurrentDate } from "@/hooks/hooks";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import { useWeatherData } from "@/hooks/useWeatherData";
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
import { currentPrecipExample } from "../averages/utils/constants";
import { ChartPressStateType } from "../graphs/utils/constants";
import {
  getMonthDayDate,
  months,
  xValueToDraggedTime,
} from "../helper-functions/helperFunctions";
import { getConditionArray } from "./utils/getConditionArray";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface GraphContainerProps {
  cityName: string;
  state: ChartPressStateType;
  isActive: boolean;
  leftSide?: React.ReactNode;
  children: React.ReactNode;
  hackyWeatherImage?: boolean;
  scrollInfoBold:
    | Partial<AnimatedProps<TextInputProps>>
    | Partial<AnimatedProps<TextInputProps>>[];
  smallBold?: boolean;
  currentIndex: number;
  tickRange?: number;
  stopLeftXValue?: number;
  stopRightXValue?: number;
  whiteTextFontSize?: number;
  last30DaysMode?: boolean;
}

const GraphContainer = ({
  cityName,
  state,
  isActive,
  leftSide,
  children,
  hackyWeatherImage = false,
  scrollInfoBold,
  smallBold = false,
  currentIndex,
  tickRange = 24,
  stopLeftXValue,
  stopRightXValue = tickRange,
  whiteTextFontSize = 20,
  last30DaysMode = false,
}: GraphContainerProps) => {
  const data = useWeatherData();
  const is12Hr = useIs12Hr();
  const currentTimeZone = data[cityName].location.tz_id;

  const { currentMonthIndex, currentDay } = getCurrentDate(currentTimeZone);
  const currentMonth = months[currentMonthIndex].slice(0, 3);
  const prevMonth = months[currentMonthIndex - 1].slice(0, 3);

  // Dynamically show time
  const draggedTime = useAnimatedProps(() => {
    const xValue = state.x.value.value;
    const time = is12Hr ? xValueToDraggedTime(xValue) : `${xValue % 24}:00`;
    const blueLineArr = currentPrecipExample;

    const calendarDate = getMonthDayDate(
      xValue,
      currentMonth,
      currentDay,
      prevMonth
    );

    const isDraggingPastToday = xValue > blueLineArr.length - 1;

    return {
      text: last30DaysMode
        ? isDraggingPastToday
          ? currentMonth + " " + currentDay
          : calendarDate
        : xValue > blueLineArr.length - 1
        ? is12Hr
          ? xValueToDraggedTime(blueLineArr.length - 1)
          : `${(blueLineArr.length - 1) % 24}:00`
        : time,
      value: time,
    };
  });

  const width = 359;
  //Translate X so time follows user drag
  const draggedTimeStyle = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;

    // Default stop when its past 12.5% of graph
    const stopLeft = hackyWeatherImage
      ? 3
      : stopLeftXValue
      ? stopLeftXValue
      : tickRange * 0.125;

    const overlapLeft = xValue < stopLeft;
    const overlapRight = xValue > stopRightXValue;

    return {
      transform: [
        {
          translateX: overlapLeft
            ? hackyWeatherImage
              ? 30
              : (stopLeft / tickRange) * width
            : overlapRight
            ? (stopRightXValue / tickRange) * width
            : xPosition,
        },
      ],
    };
  });

  // Translate X so bold text follows user drag, same as above but for bigger text
  const animatedView = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;

    const stopLeft = hackyWeatherImage
      ? 3
      : stopLeftXValue
      ? stopLeftXValue
      : tickRange * 0.125;

    const overlapLeft = xValue < stopLeft;
    const overlapRight = xValue > stopRightXValue;
    return {
      transform: [
        {
          translateX: overlapLeft
            ? hackyWeatherImage
              ? 10
              : (stopLeft / tickRange) * width
            : overlapRight
            ? hackyWeatherImage
              ? -30
              : (stopRightXValue / tickRange) * width
            : xPosition - (hackyWeatherImage ? 20 : 0),
        },
      ],
    };
  });

  const conditionArray = getConditionArray(data[cityName], currentIndex);

  // Sets width of scrollText and centers it on cursor
  const scrollInfoWidth = 200;
  const marginLeftToCenter = -(scrollInfoWidth / 2);

  return (
    <View className=" w-full relative z-0 " style={{ paddingTop: 72 }}>
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
                width: scrollInfoWidth,
                marginLeft: marginLeftToCenter,
                fontSize: 14,
                color: colors.lightGray,
              },
              draggedTimeStyle,
            ]}
            animatedProps={draggedTime}
          />

          {/* Shows user hovered weather image and temperature */}
          <AnimatedView
            style={[animatedView]}
            className="flex-row items-center"
          >
            <View style={{ width: 0, height: 35 }}>
              {hackyWeatherImage && (
                <>
                  {/* Overlay all images in same spot but toggle opacity based on user dragged line */}
                  {conditionArray.map((val, index) => (
                    <AnimatedImage
                      key={index}
                      className={"absolute top-0 left-0 "}
                      style={[
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
            </View>

            <AnimatedTextInput
              textAlign={hackyWeatherImage ? undefined : "center"}
              editable={false}
              underlineColorAndroid={"transparent"}
              style={[
                {
                  width: scrollInfoWidth,
                  marginLeft: hackyWeatherImage ? 40 : marginLeftToCenter,
                  // fontSize: smallBold ? 20 : 25,
                  fontSize: whiteTextFontSize,

                  color: "white",
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
                  width: scrollInfoWidth,
                  marginLeft: marginLeftToCenter,
                  fontSize: 12,
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
        {leftSide && (
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
        )}
      </View>

      <View
        // className="pr-4"
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
