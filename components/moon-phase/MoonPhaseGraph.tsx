import {
  View,
  Text,
  Animated,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import {
  Area,
  CartesianChart,
  ChartPressState,
  Line,
  PointsArray,
  PolarChart,
  Scatter,
  useChartPressState,
} from "victory-native";
import {
  Circle,
  Color,
  Rect,
  useFont,
  Text as SkiaText,
  LinearGradient,
  vec,
  Skia,
  Image as SkiaImage,
  useImage,
} from "@shopify/react-native-skia";
import SpaceMono from "../../assets/fonts/SpaceMono-Regular.ttf";
import {
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import OpacityCard from "../atoms/OpacityCard";
import { getChordLength, getCurrentTime, militaryHour } from "@/hooks/hooks";
import Cursor from "../graphs/victoryComponents/Cursor";

import ToolTip from "../graphs/victoryComponents/Tooltip";
import MoonSVG from "./MoonSVG";
import { SvgXml } from "react-native-svg";
import { getMoonGraphLumin } from "./utils/getMoonGraphLumin";
import { getMoonRotationDegress } from "./utils/getMoonRotationDegrees";
import { MoonPhase } from "./utils/constants";
import { getRemoveAnimationRef } from "./utils/getRemoveAnimationRef";
import { getMoonPhaseGraphData } from "./utils/getMoonPhaseGraphData";

const MoonPhaseGraph = ({
  cityName,
  state,
  graphHeight,
  addLines = false,
  initialScrollPosition,
  userScrolledIndex,
  currentPhase,
}: {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: {
      moonPath: number;
      sunPosition: number;
      phaseLine: number;
    };
  }>;
  graphHeight: number;
  addLines?: boolean;
  initialScrollPosition: number;
  userScrolledIndex: number;
  currentPhase: MoonPhase;
}) => {
  const font = useFont(SpaceMono, 12);

  const { data } = useSelector((state: RootState) => state.weather);

  const image = useImage(require("../../assets/images/moon.png"));
  const MOON_IMAGE_SIZE = 200;
  // Graph overflows a bit on the right so when rotated is offset to the right. Add some right padding to recenter it
  const GRAPH_PADDING_TO_RECENTER = 12;

  const moonGraphLumin = getMoonGraphLumin(
    data[cityName],
    userScrolledIndex - initialScrollPosition / 120
  );

  const MoonPhaseData = useMemo(() => {
    return getMoonPhaseGraphData(moonGraphLumin);
  }, [moonGraphLumin]);

  // Remove Animation when transitioning in reverse to prevent flicker
  const removeAnimationRef = getRemoveAnimationRef(currentPhase);

  const moonRotation = getMoonRotationDegress(currentPhase, moonGraphLumin);

  return (
    <>
      {/* Chart */}
      <View className="absolute w-full items-start">
        <DefaultText className="font-bold text-4xl">
          {currentPhase === "waxing"
            ? Math.round(moonGraphLumin) + "%"
            : 100 - Math.round(moonGraphLumin) + "%"}
        </DefaultText>
      </View>

      <View
        style={{ overflow: "hidden", paddingRight: GRAPH_PADDING_TO_RECENTER }}
      >
        <View
          style={{
            height: graphHeight,
            width: "100%",
            transform: [{ rotate: moonRotation + "deg" }],
            overflow: "hidden",
          }}
        >
          <CartesianChart
            data={MoonPhaseData}
            xKey="day"
            yKeys={["moonPath", "sunPosition", "phaseLine"]}
            xAxis={{
              font: addLines ? font : null,
              labelColor: addLines ? colors.lightGray : "transparent",
              lineColor: addLines ? "white" : "transparent",
            }}
            yAxis={[
              {
                font: addLines ? font : null,
                labelColor: addLines ? colors.lightGray : "transparent",
                lineColor: addLines ? "white" : "transparent",
              },
            ]}
            frame={{
              lineColor: "transparent",
            }}
            domain={{ y: [-12, 12] }}
            chartPressState={state}
            padding={{ bottom: addLines ? 10 : 0 }}
          >
            {({ points, chartBounds, canvasSize }) => {
              return (
                <>
                  <>
                    <SkiaImage
                      image={image}
                      rect={{
                        x: canvasSize.width / 2 + 8 - MOON_IMAGE_SIZE / 2,
                        y: canvasSize.height / 2 - 4 - MOON_IMAGE_SIZE / 2,
                        width: MOON_IMAGE_SIZE,
                        height: MOON_IMAGE_SIZE,
                      }}
                    />
                    <>
                      {/* <Line
                        points={points.moonPath}
                        color={colors.bgWhite(0.5)}
                        strokeWidth={strokeWidth}
                        curveType="natural"
                      /> */}

                      <Area
                        points={points.moonPath}
                        y0={
                          currentPhase === "waxing"
                            ? chartBounds.bottom
                            : chartBounds.top
                        }
                        color={colors.bgBlack(0.6)}
                        animate={{
                          type: "timing",
                          duration: removeAnimationRef.current ? 0 : 300,
                        }}
                      />

                      {/* Day time */}
                      {/* <Line
                      points={dayTime}
                      color={colors.bgWhite(0.5)}
                      strokeWidth={strokeWidth}
                      curveType="natural"
                    /> */}

                      {/* Night time right side */}
                      {/* <Line
                      points={nightTime2}
                      color={colors.bgBlack(0.5)}
                      strokeWidth={strokeWidth}
                      curveType="natural"
                    /> */}
                    </>

                    {/* Phase Line */}
                    {/* <Line
                      points={points.phaseLine}
                      color={colors.bgWhite(0.5)}
                      strokeWidth={strokeWidth - 3}
                      curveType="natural"
                    /> */}

                    {/* Sun Position */}
                    {/* <Scatter
                    points={points.sunPosition}
                    shape="circle"
                    radius={strokeWidth + 2}
                    style="fill"
                    color="white"
                  /> */}
                  </>
                  {/* {isActive && !removePress ? (
                  <ToolTip x={state.x.position} y={state.y.moonPath.position} />
                ) : null} */}
                </>
              );
            }}
          </CartesianChart>
        </View>
      </View>
    </>
  );
};

export default MoonPhaseGraph;
