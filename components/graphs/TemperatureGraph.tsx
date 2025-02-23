import { View } from "react-native";
import React from "react";
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
  useImage,
  Canvas,
} from "@shopify/react-native-skia";
import SpaceMono from "../../assets/fonts/SpaceMono-Regular.ttf";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { getCurrentHour, getCurrentTime, militaryHour } from "@/hooks/hooks";
import { colors } from "@/assets/colors/colors";
import { weatherPNG } from "@/utils/exampleForecast";
import { weatherKey, WeatherType } from "@/constants/constants";
import getFont from "@/hooks/getFont";
import { regularTimeOnXAxis } from "../sun-phase/SunPhaseGraph";
import Cursor from "../victory-native/cursor";

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
}

const TemperatureGraph = ({
  cityName,
  state,
  isActive,
  graphHeight,
  strokeWidth,
  yAxisLabel,
}: TemperatureGraphProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { location, forecast } = data[cityName];

  const font = getFont();

  const currentHour = militaryHour(
    new Date().toLocaleTimeString("en-US", { timeZone: location?.tz_id })
  );

  const weekMaxTemp = Math.max(
    ...forecast?.forecastday.map((day) => parseFloat(day.day.maxtemp_c))
  );

  const weekMinTemp = Math.min(
    ...forecast?.forecastday.map((day) => parseFloat(day.day.mintemp_c))
  );

  const maxRange = weekMaxTemp + 3;
  const minRange = weekMinTemp - 3;

  // Add midnight value
  const todaysForecast = forecast?.forecastday[0].hour;
  const addMidnightWeather = [
    ...todaysForecast,
    { temp_c: todaysForecast[todaysForecast.length - 1].temp_c },
  ];

  const currentTime = getCurrentTime(location?.tz_id);

  const xPosition = Math.floor(regularTimeOnXAxis(currentTime));

  const hourlyTempData = addMidnightWeather.map((hour, index) => ({
    hour: index,
    celsius: parseFloat(hour.temp_c),
    currentLineTop: index === currentHour ? maxRange + 2 : undefined,
    currentLineBottom: index === currentHour ? minRange - 2 : undefined,
    currentPosition:
      index === xPosition ? Math.round(parseFloat(hour.temp_c)) : undefined,
  }));

  const cutoff = getCurrentHour(location!.tz_id);

  const conditionArray =
    forecast &&
    forecast?.forecastday[0]?.hour.map((hour) => {
      // console.log(hour.condition.text.toLowerCase());
      return useImage(
        weatherKey[
          weatherPNG(
            hour.condition.text.toLowerCase() as WeatherType,
            hour.is_day
          )
        ]
      );
    });

  const oddConditionImages = conditionArray.filter((img, index) => {
    if (index % 2 === 1) {
      return img;
    }
  });

  const areaColorTop = "rgba(124,197,227,0.4)";
  const areaColorBottom = "rgba(124,197,227,0.2)";

  const areaDarkTop = "rgba(0,0,0,0.2)";
  const areaDarkBottom = "rgba(0,0,0,0.3)";

  return (
    <View style={{ height: graphHeight }}>
      <CartesianChart
        data={hourlyTempData!}
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
        domain={{ y: [minRange, maxRange] }}
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
              {/* Right side of graph*/}
              <>
                <Line
                  points={rightPoints}
                  color={colors.blue}
                  strokeWidth={6}
                  curveType="natural"
                />
                <Area
                  points={rightPoints}
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

              {/* Weather images displayed on top */}
              <>
                {oddConditionImages.map((img, index) => (
                  <Image
                    key={index}
                    image={img}
                    fit="contain"
                    x={5 + index * 24}
                    y={10}
                    width={18}
                    height={18}
                  />
                ))}
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
                <ToolTip x={state.x.position} y={state.y.celsius.position} />
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return (
    <>
      {/* <Rect x={rectX} y={0} width={width} height={500} color="white" />
      <Circle cx={x} cy={y} r={10} color="black" />
      <Circle cx={x} cy={y} r={8} color="white" /> */}
      <Cursor x={x} y={y} width={1} />
    </>
  );
}

export default TemperatureGraph;
