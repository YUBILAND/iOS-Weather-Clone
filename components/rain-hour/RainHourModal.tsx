import { colors } from "@/assets/colors/colors";
import { useWeatherData } from "@/hooks/useWeatherData";
import React from "react";
import { TextInput, View } from "react-native";
import { useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import BarGraph from "./BarGraph";
import RainHourModalDescription from "./RainHourModalDescription";
import { useRainGraphData } from "./utils/useRainGraphData";
import ModalHeader from "../modal/ModalHeader";
import ModalBoxTitle from "../modal/ModalBoxTitle";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useLayout } from "@/hooks/useLayout";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface RainHourModalProps {
  cityName: string;
}

const RainHourModal = ({ cityName }: RainHourModalProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { minute: 0, mainBar: 0 },
  });

  const rainHourDragValue = useAnimatedProps(() => {
    const yValue = state.y.mainBar.value.value;

    const rainLevelText =
      yValue < 1 ? "Light" : yValue < 2 ? "Moderate" : "Heavy";

    return {
      text: rainLevelText,
      value: rainLevelText,
    };
  });

  const data = useWeatherData();
  const { location } = data[cityName];

  //   Map is so graph data is integer so lines line up for heavy moderate light text.
  const rainGraphData = useRainGraphData(cityName);

  const topText = "Possible Light Rain";
  const bottomText = "Precipitation Intensity";

  const { layout, onLayout } = useLayout();

  const dragWidth = 100;

  const draggedVariableStyle = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;

    const tickRange = 60;

    // Default stop when its past 12.5% of graph
    const stopLeft = tickRange * 0.125;
    const stopRight = tickRange * (1 - 0.125);

    const overlapLeft = xValue < stopLeft;
    const overlapRight = xValue > stopRight;

    // Layout width minus dragWidth so its right corner snaps to the border
    const dragValRightX = layout ? layout?.width - dragWidth : 0;

    return {
      transform: [
        {
          translateX: overlapLeft
            ? 0
            : overlapRight
            ? dragValRightX
            : xPosition - dragWidth / 2,
        },
      ],
    };
  });

  return (
    <View>
      <View className="px-4 ">
        <View className="pb-2 gap-y-1">
          <View className="relative">
            <View style={{ opacity: isActive ? 0 : 1 }}>
              <ModalBoxTitle title={topText} subTitle={bottomText} />
            </View>

            <View
              style={{ opacity: isActive ? 1 : 0 }}
              className="absolute top-0 left-0 h-full items-center justify-center"
            >
              <AnimatedTextInput
                textAlign={"center"}
                editable={false}
                underlineColorAndroid={"transparent"}
                style={[
                  {
                    width: dragWidth,
                    marginLeft: 0,
                    color: "white",
                    fontSize: 24,
                    fontWeight: 700,
                  },
                  draggedVariableStyle,
                ]}
                animatedProps={rainHourDragValue}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            paddingBottom: 8,
            borderRadius: 10,
            overflow: "hidden",
            borderColor: colors.lightGray,
            borderWidth: 0.2,
          }}
          onLayout={onLayout}
        >
          <BarGraph
            cityName={cityName}
            state={state}
            isActive={isActive}
            graphData={rainGraphData}
            domainTop={4.5}
            graphHeight={250}
          />
        </View>
      </View>

      <RainHourModalDescription cityName={cityName} />
    </View>
  );
};

export default RainHourModal;
