import { colors } from "@/assets/colors/colors";
import getFont from "@/hooks/getFont";
import { getCurrentHour } from "@/hooks/hooks";
import { RootState } from "@/state/store";
import {
  DashPathEffect,
  Image,
  LinearGradient,
  vec,
  Text,
} from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import {
  Area,
  Bar,
  CartesianChart,
  ChartPressState,
  Line,
  Scatter,
} from "victory-native";
import { getOddConditionImages } from "../hourly-forecast/utils/getOddConditionImages";
import ToolTip from "../graphs/victoryComponents/Tooltip";
import { getGraphData } from "../graphs/utils/getGraphData";
import { getOddUVIndex } from "./utils/getOddUVIndex";

interface UVGraphProps {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: {
      uvIndex: number;
      currentLineTop: number;
      currentLineBottom: number;
      currentPosition: number;
    };
  }>;
  isActive: boolean;
  graphHeight: number;
  strokeWidth: number;
  yAxisLabel: string;
  currentIndex: number;
}

const UVGraph = ({
  cityName,
  state,
  isActive,
  graphHeight,
  strokeWidth,
  yAxisLabel,
  currentIndex,
}: UVGraphProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { location } = data[cityName];

  const font = getFont();

  const maxRange = 11;
  const minRange = 0;

  const graphData = getGraphData(
    data[cityName],
    maxRange,
    minRange,
    currentIndex,
    "uvIndex",
    "uv"
  );

  type curveType =
    | "linear"
    | "natural"
    | "step"
    | "bumpX"
    | "bumpY"
    | "cardinal"
    | "cardinal50"
    | "catmullRom"
    | "catmullRom0"
    | "catmullRom100"
    | "monotoneX";

  const lineShape: curveType = "linear";

  const cutoff = getCurrentHour(location!.tz_id);

  const oddUVIndex = getOddUVIndex(data[cityName], currentIndex);

  const areaColorTop = "rgba(86, 244, 149, 0.4)";
  const areaColorBottom = "rgba(81, 255, 115, 0.2)";
  const areaDarkTop = "rgba(0,0,0,0.2)";
  const areaDarkBottom = "rgba(0,0,0,0.3)";

  console.log("RERENDERED");

  return (
    <View style={{ height: graphHeight }}>
      <CartesianChart
        data={graphData!}
        xKey="hour"
        yKeys={[
          "uvIndex",
          "currentLineTop",
          "currentLineBottom",
          "currentPosition",
        ]}
        padding={{ left: 0, right: 20 }} // doesn't affect position outside
        axisOptions={{
          font,
          lineWidth: 2,
          tickCount: { x: 4, y: 8 },
        }}
        xAxis={{
          font: font,
          axisSide: "bottom",
          tickValues: [0, 6, 12, 18, 24],
          labelColor: "white",
          lineColor: colors.mediumGray,
        }}
        yAxis={[
          {
            formatYLabel: (label) => label + yAxisLabel,
            font: font,
            axisSide: "right",
            labelColor: "white",
            lineColor: colors.mediumGray,
          },
        ]}
        domain={{ y: [minRange, maxRange] }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => {
          // 👇 and we'll use the Line component to render a line path.
          const leftPoints = points.uvIndex.filter(
            (point) => (point.xValue! as number) <= cutoff
          ); // Left side (x <= 0)
          const rightPoints = points.uvIndex.filter(
            (point) => (point.xValue! as number) >= cutoff
          ); // Right side (x >= 0)
          return (
            <>
              {/* Top graph content */}
              <>
                {oddUVIndex.map((uv, index) => (
                  <Text
                    font={font}
                    key={index}
                    x={10 + index * 25.5}
                    y={10}
                    text={Math.round(uv).toString()}
                    color={"white"}
                  />
                ))}
              </>

              {/* Right side of graph*/}
              <>
                <Line
                  points={currentIndex === 0 ? rightPoints : points.uvIndex}
                  color={colors.green}
                  strokeWidth={6}
                  curveType={lineShape}
                />
                <Area
                  points={currentIndex === 0 ? rightPoints : points.uvIndex}
                  y0={chartBounds.bottom}
                  animate={{ type: "timing", duration: 300 }}
                  curveType={lineShape}
                >
                  <LinearGradient
                    start={vec(chartBounds.bottom, 150)}
                    end={vec(chartBounds.bottom, chartBounds.bottom)}
                    colors={[areaColorTop, areaColorBottom]}
                  />
                </Area>
              </>

              {currentIndex === 0 && (
                <>
                  {/* Left side of graph DASHED LINE*/}
                  <>
                    <Line
                      points={leftPoints}
                      // color="rgba(124,197,227,0.5)"
                      color={colors.green}
                      strokeWidth={6}
                      curveType={lineShape}
                    >
                      <DashPathEffect intervals={[10, 10]} />
                    </Line>
                    <Area
                      points={leftPoints}
                      y0={chartBounds.bottom}
                      // color="rgba(124,197,227,0.3)"
                      animate={{ type: "timing", duration: 300 }}
                      curveType={lineShape}
                    >
                      <LinearGradient
                        start={vec(chartBounds.bottom, 150)}
                        end={vec(chartBounds.bottom, chartBounds.bottom)}
                        colors={[areaColorTop, areaColorBottom]}
                      />
                    </Area>
                  </>
                  {/* Vertical Line */}
                  <>
                    <Bar
                      points={points.currentLineTop}
                      chartBounds={chartBounds}
                      barWidth={1}
                      color={colors.lightGray}
                      roundedCorners={{ topLeft: 10, topRight: 10 }}
                    />

                    <Bar
                      points={points.currentLineBottom}
                      chartBounds={chartBounds}
                      barWidth={1}
                      color={colors.lightGray}
                      roundedCorners={{ topLeft: 10, topRight: 10 }}
                    />
                  </>

                  {/* Left side darken */}
                  <>
                    <Area
                      points={leftPoints}
                      y0={chartBounds.top}
                      color={areaDarkTop}
                      animate={{ type: "timing", duration: 300 }}
                      curveType={lineShape}
                    />

                    <Area
                      points={leftPoints}
                      y0={chartBounds.bottom}
                      color={areaDarkBottom}
                      animate={{ type: "timing", duration: 300 }}
                      curveType={lineShape}
                    />
                  </>

                  {/* Current Position Circle */}
                  <>
                    <Scatter
                      points={points.currentPosition}
                      shape="circle"
                      radius={strokeWidth + 4}
                      style="fill"
                      color="black"
                    />

                    <Scatter
                      points={points.currentPosition}
                      shape="circle"
                      radius={strokeWidth}
                      style="fill"
                      color="white"
                    />
                  </>
                </>
              )}

              {isActive ? (
                <ToolTip x={state.x.position} y={state.y.uvIndex.position} />
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default UVGraph;
