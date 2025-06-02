import { colors } from "@/assets/colors/colors";
import { useWeatherData } from "@/hooks/useWeatherData";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";
import Animated, {
  AnimatedProps,
  AnimatedStyle,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import MoonPhaseGraph from "./MoonPhaseGraph";
import { TICKS_PER_DAY } from "./utils/constants";
import { getCurrentMoonPhase } from "./utils/getCurrentMoonPhase";
import { getDaysSincePrevMonth } from "./utils/getDaysSincePrevMonth";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface MoonDiagramProps {
  cityName: string;
  userScrolledIndex: number;
  handleClickMoonArrow: () => void;
  sharedDate: SharedValue<string>;
}

const MoonDiagram = ({
  cityName,
  userScrolledIndex,
  handleClickMoonArrow,
  sharedDate,
}: MoonDiagramProps) => {
  const data = useWeatherData();

  const { state } = useChartPressState({
    x: 0,
    y: { moonPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const daysSincePrevMonth = useMemo(() => getDaysSincePrevMonth(), []);
  const initialScrollPosition = TICKS_PER_DAY * daysSincePrevMonth * 10;
  const initialScrollIndex = initialScrollPosition / 10;

  const currentMoonPhase = getCurrentMoonPhase(
    data[cityName],
    userScrolledIndex,
    initialScrollIndex
  );

  const scrolledDate = useAnimatedProps(() => {
    const position = `${sharedDate.value}`;
    return {
      text: position,
      value: position,
    };
  });
  const scrolledDateStyle = useAnimatedStyle(() => {
    return {
      fontSize: 30,
      color: "white",
      fontWeight: 800,
      width: 200,
      marginLeft: 100,
    };
  });

  const MoonPhaseGraphProps = {
    cityName,
    state,
    graphHeight: 250,
    initialScrollIndex,
    userScrolledIndex,
    currentMoonPhase,
    showPercent: true,
    scaleDown: 40,
  };

  const MoonPhaseLeftArrow = () => {
    const showLeftArrow = userScrolledIndex >= initialScrollIndex + 3;
    return (
      <View style={{ flex: 20, alignItems: "center" }}>
        {showLeftArrow && (
          <Ionicons
            name="arrow-back-circle-outline"
            size={40}
            color={colors.bgBlue(1)}
            onPress={handleClickMoonArrow}
          />
        )}
      </View>
    );
  };

  const MoonPhaseRightArrow = () => {
    const showRightArrow = userScrolledIndex <= initialScrollIndex - 3;
    return (
      <View style={{ flex: 20, alignItems: "center" }}>
        {showRightArrow && (
          <Ionicons
            name="arrow-forward-circle-outline"
            size={40}
            color={colors.bgBlue(1)}
            onPress={handleClickMoonArrow}
          />
        )}
      </View>
    );
  };

  const ScrolledDate = ({
    animatedText,
    animatedStyle,
  }: {
    animatedText: AnimatedProps<TextInputProps>;
    animatedStyle: AnimatedStyle<StyleProp<TextStyle>>;
  }) => {
    return (
      <View style={{ flex: 60 }} className="flex-row justify-center">
        <AnimatedTextInput
          editable={false}
          underlineColorAndroid={"transparent"}
          style={animatedStyle}
          animatedProps={animatedText}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "black",
      }}
    >
      <View
        className="items-center"
        style={{ paddingTop: 20, paddingBottom: 8 }}
      >
        <MoonPhaseGraph {...MoonPhaseGraphProps} />
      </View>

      <View className="w-full flex-row items-center h-12">
        <MoonPhaseLeftArrow />

        {/* Problem with text going back to initial value */}
        {/* <ScrolledDate
          animatedText={scrolledDate}
          animatedStyle={scrolledDateStyle}
        /> */}

        <View style={{ flex: 60 }} className="flex-row justify-center">
          <AnimatedTextInput
            editable={false}
            underlineColorAndroid={"transparent"}
            style={scrolledDateStyle}
            animatedProps={scrolledDate}
          />
        </View>

        <MoonPhaseRightArrow />
      </View>
    </View>
  );
};

export default React.memo(MoonDiagram);
