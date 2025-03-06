import { colors } from "@/assets/colors/colors";
import getFont from "@/hooks/getFont";
import { getCurrentHour } from "@/hooks/hooks";
import { RootState } from "@/state/store";
import {
  DashPathEffect,
  Image,
  LinearGradient,
  vec,
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
import { getOddConditionImages } from "./utils/getOddConditionImages";
import ToolTip from "../graphs/victoryComponents/Tooltip";
import { getGraphData } from "../graphs/utils/getGraphData";
import { getWeekTempArr } from "../daily-forecast/utils/getWeekTempArr";

interface TemperatureGraphProps {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: {
      celsius: number;
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

const TemperatureGraph = ({
  cityName,
  state,
  isActive,
  graphHeight,
  strokeWidth,
  yAxisLabel,
  currentIndex,
}: TemperatureGraphProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { location } = data[cityName];

  const font = getFont();

  const weekTempArr = getWeekTempArr(data[cityName]);

  const weekMaxTemp = Math.max(...weekTempArr);
  const weekMinTemp = Math.min(...weekTempArr);

  const graphData = getGraphData(
    data[cityName],
    weekMaxTemp,
    weekMinTemp,
    currentIndex,
    "celsius",
    "temp_c"
  );

  const cutoff = getCurrentHour(location!.tz_id);

  const oddConditionImages = getOddConditionImages(
    data[cityName],
    currentIndex
  );

  const areaColorTop = "rgba(124,197,227,0.4)";
  const areaColorBottom = "rgba(124,197,227,0.2)";
  const areaDarkTop = "rgba(0,0,0,0.2)";
  const areaDarkBottom = "rgba(0,0,0,0.3)";

  return (
    <View style={{ height: graphHeight }}>
      <CartesianChart
        data={graphData!}
        xKey="hour"
        yKeys={[
          "celsius",
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
        domain={{ y: [weekMinTemp - 3, weekMaxTemp + 3] }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => {
          // 👇 and we'll use the Line component to render a line path.
          const leftPoints = points.celsius.filter(
            (point) => (point.xValue! as number) <= cutoff
          ); // Left side (x <= 0)
          const rightPoints = points.celsius.filter(
            (point) => (point.xValue! as number) >= cutoff
          ); // Right side (x >= 0)
          return (
            <>
              {/* Top graph content */}
              <>
                {oddConditionImages.map((img, index) => (
                  <Image
                    key={index}
                    image={img}
                    fit="contain"
                    x={5 + index * 25}
                    y={10}
                    width={18}
                    height={18}
                  />
                ))}
              </>

              {/* Right side of graph*/}
              <>
                <Line
                  points={currentIndex === 0 ? rightPoints : points.celsius}
                  color={colors.blue}
                  strokeWidth={6}
                  curveType="natural"
                />
                <Area
                  points={currentIndex === 0 ? rightPoints : points.celsius}
                  y0={chartBounds.bottom}
                  animate={{ type: "timing", duration: 300 }}
                  curveType="natural"
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
                  {/* Left side of graph*/}
                  <>
                    <Line
                      points={leftPoints}
                      // color="rgba(124,197,227,0.5)"
                      color={colors.blue}
                      strokeWidth={6}
                      curveType="natural"
                    >
                      <DashPathEffect intervals={[10, 10]} />
                    </Line>
                    <Area
                      points={leftPoints}
                      y0={chartBounds.bottom}
                      // color="rgba(124,197,227,0.3)"
                      animate={{ type: "timing", duration: 300 }}
                      curveType="natural"
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
                      curveType="natural"
                    />

                    <Area
                      points={leftPoints}
                      y0={chartBounds.bottom}
                      color={areaDarkBottom}
                      animate={{ type: "timing", duration: 300 }}
                      curveType="natural"
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
                <ToolTip x={state.x.position} y={state.y.celsius.position} />
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default TemperatureGraph;
