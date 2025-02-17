import { View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Area,
  CartesianChart,
  Line,
  PointsArray,
  useChartPressState,
  useLinePath,
} from "victory-native";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import {
  Circle,
  DashPathEffect,
  useFont,
  Line as SkiaLine,
  vec,
  Rect,
  Text,
  AnimatedProp,
  LinearGradient,
} from "@shopify/react-native-skia";
import SpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";
import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentHour, getDate } from "@/hooks/hooks";

const Chart = ({ cityName }: { cityName: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );
  const { location, forecast, current } = data[cityName];

  const font = useFont(SpaceMono, 12);

  const { state, isActive } = useChartPressState({ x: 0, y: { celsius: 0 } });

  //   console.log(forecast?.forecastday[0].)

  const hourlyTempData = forecast?.forecastday[0].hour.map((hour, index) => ({
    hour: index,
    celsius: parseFloat(hour.temp_c),
  }));

  const celsiusArr = hourlyTempData?.map((obj) => obj.celsius);

  const maxCelsius = Math.max(...celsiusArr!);
  const minCelsius = Math.min(...celsiusArr!);

  const cutoff = getCurrentHour(location!.tz_id);

  return (
    <View style={{ height: 300, paddingHorizontal: 20 }}>
      <CartesianChart
        data={hourlyTempData!}
        xKey="hour"
        yKeys={["celsius"]}
        axisOptions={{
          font,
          labelColor: "white",
          lineColor: "white",
          axisSide: { x: "bottom", y: "right" },
          labelOffset: 10,
          //   tickCount: { x: 4, y: 4 },
        }}
        xAxis={{
          font: font,
          tickValues: [0, 6, 12, 18, 23],
          labelColor: "white",
        }}
        domain={{ y: [minCelsius - 10, maxCelsius + 10] }}
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
                  color="rgba(124,197,227,0.5)"
                  strokeWidth={6}
                  curveType="natural"
                >
                  <DashPathEffect intervals={[10, 10]} />
                </Line>
                <Area
                  points={leftPoints}
                  y0={chartBounds.bottom}
                  color="rgba(124,197,227,0.3)"
                  animate={{ type: "timing", duration: 300 }}
                  curveType="natural"
                />
              </>
              {/* Right side of graph*/}
              <>
                <Line
                  points={rightPoints}
                  color="#7cc5e3"
                  strokeWidth={6}
                  curveType="natural"
                ></Line>
                <Area
                  points={rightPoints}
                  y0={chartBounds.bottom}
                  animate={{ type: "timing", duration: 300 }}
                  curveType="natural"
                >
                  <LinearGradient
                    start={vec(chartBounds.bottom, 150)}
                    end={vec(chartBounds.bottom, chartBounds.bottom)}
                    colors={["rgba(124,197,227,0.6)", "rgba(124,197,227,0.4)"]}
                  />
                </Area>
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

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 5 * Math.random(),
}));

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  const font = useFont(SpaceMono, 12);
  const width = 1;
  const rectX = useDerivedValue(() => x.value - width / 2); // offset to center line

  const text = "HELLO THERE";
  const textMetrics = font?.measureText(text);
  const textWidth = textMetrics?.width;
  const textHeight = textMetrics?.height;

  // Measure the width and height of the text

  const textX = useDerivedValue(
    () => x.value - (textWidth ? textWidth / 2 : 0)
  ); // offset to center line
  const textY = 10; // offset to center line

  return (
    <>
      <Text
        x={textX}
        y={textY} // Slightly above the circle for positioning
        font={font}
        color="white"
        text={text}
      />

      <Rect x={rectX} y={0} width={width} height={500} color="white" />

      <Circle cx={x} cy={y} r={8} color="white" />
    </>
  );
}

export default Chart;
