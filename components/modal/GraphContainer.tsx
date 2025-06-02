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
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedImage = Animated.createAnimatedComponent(Image);

type AnimationBoundary = {
  stopLeftXValue?: number;
  stopRightXValue?: number;
  tickRange?: number;
};

type DragTextSettings = {
  whiteTextFontSize?: number;
  hackyWeatherImage?: boolean;
  currentIndex: number;
  scrollInfoBold:
    | AnimatedProps<TextInputProps>
    | AnimatedProps<TextInputProps>[];
};

type ShowGraphProp = {
  children: React.ReactNode;
};

type GraphMode = {
  last30DaysMode?: boolean;
};

interface GraphContainerProps
  extends AnimationBoundary,
    DragTextSettings,
    ShowGraphProp,
    GraphMode {
  cityName: string;
  state: ChartPressStateType;
  isActive: boolean;
}

const GraphContainer = (props: GraphContainerProps) => {
  const { cityName, state, isActive } = props;

  //AnimationBoundary
  const { tickRange = 24, stopLeftXValue, stopRightXValue = tickRange } = props;
  //DragTextSettings
  const {
    hackyWeatherImage = false,
    scrollInfoBold,
    currentIndex,
    whiteTextFontSize = 20,
  } = props;
  //ShowGraphProp
  const { children: ShowGraph } = props;
  //GraphMode
  const { last30DaysMode: monthMode = false } = props;

  const data = useWeatherData();
  const is12Hr = useIs12Hr();
  const currentTimeZone = data[cityName].location.tz_id;

  const { currentMonthIndex, currentDay } = getCurrentDate(currentTimeZone);
  const currentMonth = months[currentMonthIndex].slice(0, 3);
  const prevMonth = months[currentMonthIndex - 1].slice(0, 3);

  // Dynamically show time
  const draggedTime = useAnimatedProps(() => {
    const { xValue, time } = (() => {
      const { xValue } = getStateValues(state);
      const time = is12Hr ? xValueToDraggedTime(xValue) : `${xValue % 24}:00`;
      return { xValue, time };
    })();

    const calendarDate = getMonthDayDate(
      xValue,
      currentMonth,
      currentDay,
      prevMonth
    );

    const { isDraggingPastToday, monthModeScrollDate, outOfBoundsTime } =
      (() => {
        const blueLineArr = currentPrecipExample;

        const isDraggingPastToday = xValue > blueLineArr.length - 1;

        const monthModeScrollDate = isDraggingPastToday
          ? currentMonth + " " + currentDay
          : calendarDate;

        const outOfBoundsTime = is12Hr
          ? xValueToDraggedTime(blueLineArr.length - 1)
          : `${(blueLineArr.length - 1) % 24}:00`;

        return { isDraggingPastToday, monthModeScrollDate, outOfBoundsTime };
      })();

    const text = monthMode
      ? monthModeScrollDate
      : isDraggingPastToday
      ? outOfBoundsTime
      : time;
    return {
      text: text,
      value: time,
    };
  });

  const width = 359;
  //Translate X so time follows user drag
  const draggedTimeStyle = useAnimatedStyle(() => {
    const { xPosition, xValue } = getStateValues(state);

    // Default stop when its past 12.5% of graph
    const { stopLeftHere, stopRightHere, overlapLeft, overlapRight } = (() => {
      const stopLeft = hackyWeatherImage
        ? 3
        : stopLeftXValue
        ? stopLeftXValue
        : tickRange * 0.125;

      const overlapLeft = xValue < stopLeft;
      const overlapRight = xValue > stopRightXValue;

      const stopLeftHere = (stopLeft / tickRange) * width;
      const stopRightHere = (stopRightXValue / tickRange) * width;
      return { stopLeftHere, stopRightHere, overlapLeft, overlapRight };
    })();

    const hackyWeatherOverlap = overlapLeft
      ? 30
      : overlapRight
      ? stopRightHere
      : xPosition;

    const textTranslate = overlapLeft
      ? stopLeftHere
      : overlapRight
      ? stopRightHere
      : xPosition;

    return {
      transform: [
        {
          translateX: hackyWeatherImage ? hackyWeatherOverlap : textTranslate,
        },
      ],
    };
  });

  // Translate X so bold text follows user drag, same as above but for bigger text
  const animatedView = useAnimatedStyle(() => {
    const { xPosition, xValue } = getStateValues(state);

    const { stopLeftHere, stopRightHere, overlapLeft, overlapRight } = (() => {
      const stopLeft = hackyWeatherImage
        ? 3
        : stopLeftXValue
        ? stopLeftXValue
        : tickRange * 0.125;
      const overlapLeft = xValue < stopLeft;
      const overlapRight = xValue > stopRightXValue;

      const stopLeftHere = (stopLeft / tickRange) * width;
      const stopRightHere = (stopRightXValue / tickRange) * width;
      return { stopLeftHere, stopRightHere, overlapLeft, overlapRight };
    })();

    const hackyWeatherOverlap = overlapLeft
      ? 10
      : overlapRight
      ? -30
      : xPosition - 20;

    xPosition;
    const textTranslate2 = overlapLeft
      ? stopLeftHere
      : overlapRight
      ? stopRightHere
      : xPosition;
    return {
      transform: [
        {
          translateX: hackyWeatherImage ? hackyWeatherOverlap : textTranslate2,
        },
      ],
    };
  });

  const conditionArray = getConditionArray(data[cityName], currentIndex);

  // Sets width of scrollText and centers it on cursor
  const scrollInfoWidth = 200;
  const marginLeftToCenter = -(scrollInfoWidth / 2);

  const HoveredTime = () => {
    return (
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
    );
  };

  const DisplayWeatherImages = () => {
    return (
      <View style={{ width: 0, height: 35 }}>
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
      </View>
    );
  };

  const HoveredData = () => {
    return (
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
          Array.isArray(scrollInfoBold) ? scrollInfoBold[0] : scrollInfoBold
        }
      />
    );
  };

  const showSubText = Array.isArray(scrollInfoBold);

  const HoveredSubText = () => {
    return (
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
        animatedProps={(scrollInfoBold as AnimatedProps<TextInputProps>[])[1]}
      />
    );
  };

  const HoveredTextBox = () => {
    return (
      <AnimatedView style={[animatedView]} className="flex-row items-center">
        {hackyWeatherImage && <DisplayWeatherImages />}

        <HoveredData />
      </AnimatedView>
    );
  };

  return (
    <View className=" w-full relative z-0 " style={{ paddingTop: 72 }}>
      <View className="absolute top-0 left-0">
        <View
          style={{
            opacity: isActive ? 100 : 0,
            position: "absolute",
          }}
        >
          <HoveredTime />

          <HoveredTextBox />

          {showSubText && <HoveredSubText />}
        </View>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: colors.mediumGray,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {ShowGraph}
      </View>
    </View>
  );
};

const getStateValues = (state: ChartPressStateType) => {
  "worklet";
  const xPosition = state.x.position.value;
  const xValue = state.x.value.value;

  return { xPosition, xValue };
};

export default GraphContainer;
