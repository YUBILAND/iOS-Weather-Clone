import { Colors, colors } from "@/assets/colors/colors";
import getFont from "@/hooks/getFont";
import { getCurrentHour, getCurrentTime, militaryHour } from "@/hooks/hooks";
import { RootState } from "@/state/store";
import {
  DashPathEffect,
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
import ToolTip from "../graphs/victoryComponents/Tooltip";
import { regularTimeOnXAxis } from "../sun-phase/utils/getRegularTimeOnXAxis";
import { GraphKeyType } from "@/constants/constants";

interface GraphProps<Key extends keyof GraphKeyType> {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: Record<
      "currentLineTop" | "currentLineBottom" | "currentPosition",
      number
    > &
      Pick<GraphKeyType, Key>;
  }>;

  isActive: boolean;
  graphHeight: number;
  strokeWidth: number;
  yAxisLabel: string;
  currentIndex: number;
  apiObjectString: keyof GraphKeyType;
  domainBottom: number;
  domainTop: number;
  customColor: Colors;
}

const Graph = <Key extends keyof GraphKeyType>({
  cityName,
  state,
  isActive,
  graphHeight,
  strokeWidth,
  yAxisLabel,
  currentIndex,
  apiObjectString,
  domainBottom,
  domainTop,
  customColor,
}: GraphProps<Key>) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { location, forecast } = data[cityName];

  const font = getFont();

  // To discrern which y axis key was passed
  const yAxisKey = Object.keys(state.y).find(
    (key) =>
      key !== "currentLineTop" &&
      key !== "currentLineBottom" &&
      key !== "currentPosition"
  ) as Key;

  const currentHour = militaryHour(
    new Date().toLocaleTimeString("en-US", { timeZone: location?.tz_id })
  );

  // Add midnight value
  const todaysForecast = forecast?.forecastday[currentIndex].hour;
  const addMidnightWeather = [
    ...todaysForecast,
    {
      [apiObjectString]:
        todaysForecast[todaysForecast.length - 1][
          apiObjectString as keyof GraphKeyType
        ],
    },
  ];

  const currentTime = getCurrentTime(location?.tz_id);

  const xPosition = Math.floor(regularTimeOnXAxis(currentTime));

  const hourlyData = addMidnightWeather.map((hour, index) => ({
    hour: index,
    [yAxisKey]: hour[apiObjectString as keyof GraphKeyType],
    currentLineTop: index === currentHour ? 100 : undefined,
    currentLineBottom: index === currentHour ? 0 : undefined,
    currentPosition: index === xPosition ? hour[apiObjectString] : undefined,
  }));

  const cutoff = getCurrentHour(location!.tz_id);

  const areaDarkTop = "rgba(0,0,0,0.2)";
  const areaDarkBottom = "rgba(0,0,0,0.3)";

  const curveType = "linear";

  return (
    <View style={{ height: graphHeight }} className="relative z-0">
      <CartesianChart
        data={hourlyData!}
        xKey="hour"
        yKeys={[
          yAxisKey,
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
        domain={{ y: [domainBottom, domainTop] }}
        chartPressState={state}
      >
        {({ points, chartBounds }) => {
          // 👇 and we'll use the Line component to render a line path.
          const leftPoints = points[yAxisKey].filter(
            (point) => (point.xValue! as number) <= cutoff
          ); // Left side (x <= 0)
          const rightPoints = points[yAxisKey].filter(
            (point) => (point.xValue! as number) >= cutoff
          ); // Right side (x >= 0)
          return (
            <>
              {/* Right side of graph*/}
              <>
                <Line
                  points={currentIndex === 0 ? rightPoints : points[yAxisKey]}
                  color={colors[customColor](1)}
                  strokeWidth={6}
                  curveType={curveType}
                />
                <Area
                  points={currentIndex === 0 ? rightPoints : points[yAxisKey]}
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
                <ToolTip x={state.x.position} y={state.y[yAxisKey].position} />
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default Graph;
