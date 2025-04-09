import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import { militaryHour } from "@/hooks/hooks";
import React from "react";
import { Dimensions, TextInput, View } from "react-native";
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
  is12Hr: boolean;
  data: WeatherData;
}
const SunPhaseDraggableTime = ({
  data,
  is12Hr,
  state,
  isActive,
}: SunPhaseDraggableTimeProps) => {
  const { width } = Dimensions.get("screen");

  const animatedHour = useAnimatedProps(() => {
    const hourConversion = Math.floor((state.x.value.value * 60) / 60);
    const minuteConversion: number =
      (Math.round(state.x.value.value * 60 * 100) / 100) % 60;

    const hourHandleMidnight = hourConversion % 24;
    const addZeroToHour = hourHandleMidnight < 10;
    const addZeroToMinute = minuteConversion < 10;

    const timeIn24 =
      (addZeroToHour
        ? "0" + hourHandleMidnight.toString()
        : hourHandleMidnight.toString()) +
      ":" +
      (addZeroToMinute
        ? "0" + minuteConversion.toString()
        : minuteConversion.toString());

    const americanHour = parseInt(timeIn24.split(":")[0]) % 13;
    const americanMins = timeIn24.split(":")[1].split(" ")[0];
    const amOrPm = parseInt(timeIn24.split(":")[0]) >= 12 ? " PM" : " AM";

    const timeIn12 = americanHour + ":" + americanMins + amOrPm;

    const time = is12Hr ? timeIn12 : timeIn24;
    return {
      text: time,
      value: time,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;
    const stopRight = is12Hr ? 18 : 21;
    return {
      transform: [
        {
          translateX:
            xValue < 3
              ? (3 / 24) * width - 50
              : xValue > stopRight
              ? ((stopRight - 2) / 24) * width - 40
              : xPosition - 50,
        },
      ],
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;
    const stopRight = is12Hr ? 18 : 21;
    return {
      transform: [
        {
          translateX:
            xValue < 3
              ? (3 / 24) * width - 100
              : xValue > stopRight
              ? ((stopRight - 2) / 24) * width - 90
              : xPosition - 100,
        },
      ],
    };
  });

  const animatedPhase = useAnimatedProps(() => {
    const yValue = state.y.sunPath.value.value;
    return {
      text: yValue > 0 ? "Day" : "Night",
      value: yValue > 0 ? "Day" : "Night",
    };
  });

  const animatedRemaining = useAnimatedProps(() => {
    const yValue = state.y.sunPath.value.value;
    const xValue = state.x.value.value;

    // Convert dragged X to X Axis Format
    const hourConversion = Math.floor((xValue * 60) / 60);
    const minuteConversion: number = (Math.round(xValue * 60 * 100) / 100) % 60;

    // Add Zero If Single Digit
    const addZeroToHour = hourConversion < 10;
    const addZeroToMinute = minuteConversion < 10;

    // Get dragged X Axis Format to Actual Time
    const timeIn24 =
      (addZeroToHour
        ? "0" + hourConversion.toString()
        : hourConversion.toString()) +
      ":" +
      (addZeroToMinute
        ? "0" + minuteConversion.toString()
        : minuteConversion.toString());
    const americanHour = parseInt(timeIn24.split(":")[0]) % 13;
    const americanMins = timeIn24.split(":")[1].split(" ")[0];
    const amOrPm = parseInt(timeIn24.split(":")[0]) >= 12 ? " PM" : " AM";
    const timeIn12 = americanHour + ":" + americanMins + amOrPm;
    const time = is12Hr ? timeIn12 : timeIn24;

    // This gets current dragged time in X Axis Format
    const draggedTimeHr = parseInt(time.split(":")[0]);
    const draggedTimeMin = parseInt(time.split(":")[1]) / 60;
    const draggedTimeX = draggedTimeHr + draggedTimeMin;

    const timeStringToX = (timeString: string) => {
      const hourString = timeString.split(":")[0];
      const minuteString = timeString.split(":")[1].split(" ")[0];
      const remainingTimeInX =
        parseInt(hourString) + parseInt(minuteString) / 60;
      return remainingTimeInX;
    };

    const timeUntilIntersection = (x: number) => {
      const intersection = Math.round(x * 100) / 100;
      const remainingXAxis = Math.abs(intersection - draggedTimeX);

      const remainingHour = remainingXAxis.toString().split(".")[0];
      const remainingMinute = Math.round(
        parseFloat("." + remainingXAxis.toString().split(".")[1]) * 60
      );
      return { remainingHour, remainingMinute };
    };

    const get24HrTime = (timeString: string) => {
      const timeIn24HrStr =
        militaryHour(timeString) + ":" + timeString.split(":")[1].split(" ")[0];
      return timeIn24HrStr;
    };

    // Get Remaining Time Until First intersection
    const todaysSunrise = data.forecast.forecastday[0].astro.sunrise;
    const todaysSunriseX = timeStringToX(todaysSunrise);
    const {
      remainingHour: firstIntersectionHour,
      remainingMinute: firstIntersectionMinute,
    } = timeUntilIntersection(todaysSunriseX);

    // Get Remaining Time Until Second intersection
    const todaysSunset = get24HrTime(data.forecast.forecastday[0].astro.sunset);
    const todaysSunsetX = timeStringToX(todaysSunset);
    const {
      remainingHour: secondIntersectionHour,
      remainingMinute: secondIntersectionMinute,
    } = timeUntilIntersection(todaysSunsetX);

    // Get Remaining Time Until Third intersection
    const tomorrowsSunrise = data.forecast.forecastday[1].astro.sunrise;
    const tomorrowsSunriseX = timeStringToX(tomorrowsSunrise);
    const {
      remainingHour: thirdIntersectionHour,
      remainingMinute: thirdIntersectionMinute,
    } = timeUntilIntersection(tomorrowsSunriseX + 24);

    const showHour =
      xValue < todaysSunriseX
        ? firstIntersectionHour
        : xValue < todaysSunsetX
        ? secondIntersectionHour
        : thirdIntersectionHour;

    const showMinute =
      xValue < todaysSunriseX
        ? firstIntersectionMinute
        : xValue < todaysSunsetX
        ? secondIntersectionMinute
        : thirdIntersectionMinute;

    return {
      text:
        (yValue > 0 ? "Sunset:" : "Sunrise:") +
        " " +
        showHour +
        "HR " +
        showMinute +
        "MIN",
      value:
        (yValue > 0 ? "Sunset:" : "Sunrise:") +
        " " +
        showHour +
        "HR " +
        showMinute +
        "MIN",
    };
  });

  return (
    <View
      className="absolute top-0 left-0"
      style={{ opacity: isActive ? 100 : 0 }}
    >
      <AnimatedTextInput
        textAlign={"center"}
        style={[
          {
            fontSize: 14,
            color: colors.lightGray,
            width: 100,
            fontWeight: 600,
          },
          animatedStyle,
        ]}
        animatedProps={animatedPhase}
      />
      <AnimatedTextInput
        textAlign={"center"}
        style={[
          {
            fontSize: 32,
            color: "white",
            width: 100,
            fontWeight: 600,
          },
          animatedStyle,
        ]}
        animatedProps={animatedHour}
      />
      <AnimatedTextInput
        textAlign={"center"}
        style={[
          {
            fontSize: 10,
            color: colors.lightGray,
            width: 200,
            fontWeight: 600,
          },
          animatedStyle2,
        ]}
        animatedProps={animatedRemaining}
      />
    </View>
  );
};

export default SunPhaseDraggableTime;
