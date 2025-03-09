import { colors } from "@/assets/colors/colors";
import { RootState } from "@/state/store";
import {
  Group,
  Mask,
  Rect,
  Image as SkiaImage,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { Area, CartesianChart, ChartPressState } from "victory-native";
import SpaceMono from "../../assets/fonts/SpaceMono-Regular.ttf";
import DefaultText from "../atoms/DefaultText";

import { MoonPhase, TICKS_PER_DAY } from "./utils/constants";
import { getMoonGraphLumin } from "./utils/getMoonGraphLumin";
import { getMoonPhaseGraphData } from "./utils/getMoonPhaseGraphData";
import { getMoonRotationDegress } from "./utils/getMoonRotationDegrees";
import { getRemoveAnimationRef } from "./utils/getRemoveAnimationRef";

const MoonPhaseGraph = ({
  cityName,
  state,
  graphHeight,
  addLines = false,
  initialScrollPosition,
  userScrolledIndex,
  currentMoonPhase,
  scaleDown = 0,
  showPercent = false,
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
  currentMoonPhase: MoonPhase;
  scaleDown?: number;
  showPercent?: boolean;
}) => {
  const font = useFont(SpaceMono, 12);

  const { data } = useSelector((state: RootState) => state.weather);

  const image = useImage(require("../../assets/images/moon.png"));
  // Graph overflows a bit on the right so when rotated is offset to the right. Add some right padding to recenter it
  const GRAPH_XPADDING_TO_RECENTER = addLines ? 12 : 0;
  const GRAPH_YPADDING_TO_RECENTER = addLines ? 14 : 0;
  // const halfSize = -120;
  const halfSize = -scaleDown;

  const MOON_IMAGE_SIZE = addLines ? 230 + halfSize : 260 + halfSize;

  const moonGraphLumin = getMoonGraphLumin(
    data[cityName],
    userScrolledIndex - initialScrollPosition / (TICKS_PER_DAY * 10)
  );

  const MoonPhaseData = useMemo(() => {
    return getMoonPhaseGraphData(moonGraphLumin);
  }, [moonGraphLumin]);

  // Remove Animation when transitioning in reverse to prevent flicker
  const removeAnimationRef = getRemoveAnimationRef(currentMoonPhase);

  const moonRotation = getMoonRotationDegress(currentMoonPhase, moonGraphLumin);

  return (
    <>
      {showPercent && (
        <View className="absolute w-full items-start">
          <DefaultText className="font-bold text-4xl">
            {currentMoonPhase === "waxing"
              ? Math.round(moonGraphLumin) + "%"
              : 100 - Math.round(moonGraphLumin) + "%"}
          </DefaultText>
        </View>
      )}
      {/* Chart */}

      <View
        style={{
          overflow: "hidden",
          height: 260 + halfSize,
          width: 260 + halfSize,
        }}
      >
        <View
          style={{
            height: "100%",
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
            viewport={{ x: [-7.5, 7.5] }}
            domain={{ y: [-10, 10] }}
            chartPressState={state}
            padding={{ bottom: addLines ? 10 : -8, left: addLines ? 0 : -4 }}
          >
            {({ points, chartBounds, canvasSize }) => {
              const moonCenterX =
                canvasSize.width / 2 +
                GRAPH_XPADDING_TO_RECENTER -
                MOON_IMAGE_SIZE / 2;
              const moonCenterY =
                canvasSize.height / 2 -
                GRAPH_YPADDING_TO_RECENTER -
                MOON_IMAGE_SIZE / 2;
              return (
                <>
                  <Mask
                    mode="luminance"
                    mask={
                      <Group>
                        <SkiaImage
                          image={image}
                          rect={{
                            x: moonCenterX,
                            y: moonCenterY,
                            width: MOON_IMAGE_SIZE,
                            height: MOON_IMAGE_SIZE,
                          }}
                        />
                        <Area
                          points={points.moonPath}
                          y0={
                            currentMoonPhase === "waxing"
                              ? chartBounds.bottom
                              : chartBounds.top
                          }
                          color={colors.bgBlack(0.8)}
                          animate={{
                            type: "timing",
                            duration: removeAnimationRef.current ? 0 : 300,
                          }}
                        />
                      </Group>
                    }
                    children={
                      <Rect
                        x={0}
                        y={0}
                        width={256}
                        height={256}
                        color={colors.bgWhite(1)}
                      />
                    }
                  />
                  <>
                    {/* <SkiaImage
                      image={image}
                      rect={{
                        x:
                          canvasSize.width / 2 +
                          GRAPH_XPADDING_TO_RECENTER -
                          MOON_IMAGE_SIZE / 2,
                        y:
                          canvasSize.height / 2 -
                          GRAPH_YPADDING_TO_RECENTER -
                          MOON_IMAGE_SIZE / 2,
                        width: MOON_IMAGE_SIZE,
                        height: MOON_IMAGE_SIZE,
                      }}
                    /> */}

                    <>
                      {/* Dark area of moon */}
                      {/* <Area
                          points={points.moonPath}
                          y0={
                            currentMoonPhase === "waxing"
                              ? chartBounds.bottom
                              : chartBounds.top
                          }
                          color={colors.bgBlack(0.6)}
                          animate={{
                            type: "timing",
                            duration: removeAnimationRef.current ? 0 : 300,
                          }}
                          mask={moonPath}
                        /> */}

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
