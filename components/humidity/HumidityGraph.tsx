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
// import { regularTimeOnXAxis } from "../sun-phase/SunPhaseGraph";
import { regularTimeOnXAxis } from "../sun-phase/utils/getRegularTimeOnXAxis";
import Cursor from "../graphs/victoryComponents/Cursor";
import ToolTip from "../graphs/victoryComponents/Tooltip";

interface HumidityGraphProps {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: {
      humidity: number;
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

const HumidityGraph = ({
  cityName,
  state,
  isActive,
  graphHeight,
  strokeWidth,
  yAxisLabel,
  currentIndex,
}: HumidityGraphProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { location, forecast } = data[cityName];

  const font = getFont();

  const currentHour = militaryHour(
    new Date().toLocaleTimeString("en-US", { timeZone: location?.tz_id })
  );

  // Add midnight value
  const todaysForecast = forecast?.forecastday[currentIndex].hour;
  const addMidnightWeather = [
    ...todaysForecast,
    {
      humidity: todaysForecast[todaysForecast.length - 1].humidity,
    },
  ];

  const currentTime = getCurrentTime(location?.tz_id);

  const xPosition = Math.floor(regularTimeOnXAxis(currentTime));

  const hourlyHumidityData = addMidnightWeather.map((hour, index) => ({
    hour: index,
    humidity: hour.humidity,
    currentLineTop: index === currentHour ? 100 : undefined,
    currentLineBottom: index === currentHour ? 0 : undefined,
    currentPosition: index === xPosition ? hour.humidity : undefined,
  }));

  const cutoff = getCurrentHour(location!.tz_id);

  const areaDarkTop = "rgba(0,0,0,0.2)";
  const areaDarkBottom = "rgba(0,0,0,0.3)";

  const curveType = "linear";

  const customColor = "bgWhite";

  return (
    <View style={{ height: graphHeight }} className="relative z-0">
      <CartesianChart
        data={hourlyHumidityData!}
        xKey="hour"
        yKeys={[
          "humidity",
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
            axisSide: "right",
            labelColor: "white",
            lineColor: colors.mediumGray,
          },
        ]}
        domain={{ y: [0, 110] }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => {
          // 👇 and we'll use the Line component to render a line path.
          const leftPoints = points.humidity.filter(
            (point) => (point.xValue! as number) <= cutoff
          ); // Left side (x <= 0)
          const rightPoints = points.humidity.filter(
            (point) => (point.xValue! as number) >= cutoff
          ); // Right side (x >= 0)
          return (
            <>
              {/* Right side of graph*/}
              <>
                <Line
                  points={currentIndex === 0 ? rightPoints : points.humidity}
                  color={colors[customColor](1)}
                  strokeWidth={6}
                  curveType={curveType}
                />
                <Area
                  points={currentIndex === 0 ? rightPoints : points.humidity}
                  y0={chartBounds.bottom}
                  animate={{ type: "timing", duration: 300 }}
                  curveType={curveType}
                >
                  <LinearGradient
                    start={vec(chartBounds.bottom, 40)}
                    end={vec(chartBounds.bottom, chartBounds.bottom)}
                    colors={[
                      colors[customColor](0.1),
                      colors[customColor](0.3),
                      colors[customColor](0.6),
                    ]}
                  />
                </Area>
              </>
              {currentIndex === 0 && (
                <>
                  {/* Left side of graph*/}
                  <>
                    <Line
                      points={leftPoints}
                      color={colors[customColor](0.6)}
                      strokeWidth={6}
                      curveType={curveType}
                    >
                      <DashPathEffect intervals={[10, 10]} />
                    </Line>
                    <Area
                      points={leftPoints}
                      y0={chartBounds.bottom}
                      color={colors[customColor](0.6)}
                      animate={{ type: "timing", duration: 300 }}
                      curveType={curveType}
                    >
                      <LinearGradient
                        start={vec(chartBounds.bottom, 40)}
                        end={vec(chartBounds.bottom, chartBounds.bottom)}
                        colors={[
                          colors[customColor](0.1),
                          colors[customColor](0.3),
                          colors[customColor](0.6),
                        ]}
                      />
                    </Area>
                  </>

                  {/* Vertical Line */}
                  <>
                    <Bar
                      points={points.currentLineTop}
                      chartBounds={chartBounds}
                      barWidth={1}
                      color={colors.bgWhite(0.5)}
                      roundedCorners={{ topLeft: 10, topRight: 10 }}
                    />

                    <Bar
                      points={points.currentLineBottom}
                      chartBounds={chartBounds}
                      barWidth={1}
                      color={colors.bgWhite(0.5)}
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
                      curveType={curveType}
                    />

                    <Area
                      points={leftPoints}
                      y0={chartBounds.bottom}
                      color={areaDarkBottom}
                      animate={{ type: "timing", duration: 300 }}
                      curveType={curveType}
                    />
                  </>

                  {/* Current Position Circle */}
                  <>
                    {/* Black circle border */}
                    <Scatter
                      points={points.currentPosition}
                      shape="circle"
                      radius={strokeWidth + 4}
                      style="fill"
                      color="black"
                    />
                    {/* White inner circle */}
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
                <ToolTip x={state.x.position} y={state.y.humidity.position} />
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default HumidityGraph;
