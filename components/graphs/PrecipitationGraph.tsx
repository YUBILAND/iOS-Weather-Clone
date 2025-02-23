import { Dimensions, View } from "react-native";
import React, { useEffect } from "react";
import {
  Area,
  Bar,
  CartesianChart,
  ChartPressState,
  Line,
  Scatter,
} from "victory-native";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import {
  Circle,
  DashPathEffect,
  useFont,
  vec,
  Rect,
  LinearGradient,
  Image,
} from "@shopify/react-native-skia";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { getCurrentHour, getCurrentTime, militaryHour } from "@/hooks/hooks";
import { colors } from "@/assets/colors/colors";
import getFont from "@/hooks/getFont";
import { regularTimeOnXAxis } from "../sun-phase/SunPhaseGraph";
import Cursor from "../victory-native/cursor";

interface PrecipitationGraphProps {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: {
      chanceOfRain: number;
      currentLineTop: number;
      currentLineBottom: number;
      currentPosition: number;
    };
  }>;
  isActive: boolean;
  graphHeight: number;
  strokeWidth: number;
  yAxisLabel: string;
}

const PrecipitationGraph = ({
  cityName,
  state,
  isActive,
  graphHeight,
  strokeWidth,
  yAxisLabel,
}: PrecipitationGraphProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { location, forecast } = data[cityName];

  const font = getFont();

  const currentHour = militaryHour(
    new Date().toLocaleTimeString("en-US", { timeZone: location?.tz_id })
  );

  // Add midnight value
  const todaysForecast = forecast?.forecastday[0].hour;
  const addMidnightWeather = [
    ...todaysForecast,
    {
      chance_of_rain: todaysForecast[todaysForecast.length - 1].chance_of_rain,
    },
  ];

  const currentTime = getCurrentTime(location?.tz_id);

  const xPosition = Math.floor(regularTimeOnXAxis(currentTime));

  const hourlyTempData = addMidnightWeather.map((hour, index) => ({
    hour: index,
    chanceOfRain: hour.chance_of_rain,
    currentLineTop: index === currentHour ? 100 : undefined,
    currentLineBottom: index === currentHour ? 0 : undefined,
    currentPosition:
      index === xPosition ? Math.round(hour.chance_of_rain) : undefined,
  }));

  const cutoff = getCurrentHour(location!.tz_id);

  const areaDarkTop = "rgba(0,0,0,0.2)";
  const areaDarkBottom = "rgba(0,0,0,0.3)";

  return (
    <View style={{ height: graphHeight }}>
      <CartesianChart
        data={hourlyTempData!}
        xKey="hour"
        yKeys={[
          "chanceOfRain",
          "currentLineTop",
          "currentLineBottom",
          "currentPosition",
        ]}
        padding={{ left: 0, right: 20 }} // doesn't affect position outside
        axisOptions={{
          font,
          lineWidth: 2,
        }}
        xAxis={{
          font: font,
          tickValues: [0, 6, 12, 18, 24],
          labelColor: "white",
          lineColor: colors.mediumGray,
        }}
        yAxis={[
          {
            formatYLabel: (label) => label + yAxisLabel,
            font: font,
            tickValues: Array(11)
              .fill(0)
              .map((_, idx) => idx * 10),
            axisSide: "right",
            labelColor: "white",
            lineColor: colors.mediumGray,
          },
        ]}
        domain={{ y: [0, 100] }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => {
          // 👇 and we'll use the Line component to render a line path.
          const leftPoints = points.chanceOfRain.filter(
            (point) => (point.xValue! as number) <= cutoff
          ); // Left side (x <= 0)
          const rightPoints = points.chanceOfRain.filter(
            (point) => (point.xValue! as number) >= cutoff
          ); // Right side (x >= 0)
          return (
            <>
              {/* Left side of graph*/}
              <>
                <Line
                  points={leftPoints}
                  color="rgba(124,197,227,0.5)"
                  strokeWidth={6}
                  curveType="linear"
                >
                  <DashPathEffect intervals={[10, 10]} />
                </Line>
                <Area
                  points={leftPoints}
                  y0={chartBounds.bottom}
                  color="rgba(124,197,227,0.3)"
                  animate={{ type: "timing", duration: 300 }}
                  curveType="linear"
                />
              </>
              {/* Right side of graph*/}
              <>
                <Line
                  points={rightPoints}
                  color={colors.blue}
                  strokeWidth={6}
                  curveType="linear"
                />
                <Area
                  points={rightPoints}
                  y0={chartBounds.bottom}
                  animate={{ type: "timing", duration: 300 }}
                  curveType="linear"
                >
                  <LinearGradient
                    start={vec(chartBounds.bottom, 150)}
                    end={vec(chartBounds.bottom, chartBounds.bottom)}
                    colors={["rgba(124,197,227,0.6)", "rgba(124,197,227,0.4)"]}
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

              {isActive ? (
                <ToolTip
                  x={state.x.position}
                  y={state.y.chanceOfRain.position}
                  xValue={state.x.value}
                  currentTime={parseInt(currentTime)}
                />
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

function ToolTip({
  x,
  y,
  xValue,
  currentTime,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  xValue: SharedValue<number>;
  currentTime: number;
}) {
  const rectWidth = 1;
  const rectX = useDerivedValue(() => x.value - rectWidth / 2); // offset to center line

  const { width, height } = Dimensions.get("window");

  return (
    <>
      <Cursor x={x} y={y} width={1} />
    </>
  );
}

export default PrecipitationGraph;
