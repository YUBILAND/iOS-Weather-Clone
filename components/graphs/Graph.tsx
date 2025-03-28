import { Colors, colors } from "@/assets/colors/colors";
import getFont from "@/hooks/getFont";
import { getCurrentHour, getCurrentTime, militaryHour } from "@/hooks/hooks";
import { RootState } from "@/state/store";
import {
  DashPathEffect,
  LinearGradient,
  vec,
  Image,
  useImage,
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
  CurveType,
  Line,
  Scatter,
} from "victory-native";
import ToolTip from "../graphs/victoryComponents/Tooltip";
import { regularTimeOnXAxis } from "../sun-phase/utils/getRegularTimeOnXAxis";
import { ChartPressStateNames, GraphKeyType } from "@/constants/constants";
import { getOddConditionImages } from "../hourly-forecast/utils/getOddConditionImages";
import { useWeatherData } from "@/hooks/useWeatherData";
import { getGraphImageAndCoord } from "./utils/getGraphImageAndCoord";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import { getGraphData } from "./utils/getGraphData";

// interface GraphConfig {
//   graphHeight: number;
//   strokeWidth: number;
//   yAxisLabel: string;
//   customColor: Colors;
//   addImages: boolean;
//   removeArea?: boolean;
//   curveType?: CurveType;
//   areaDarkTop?: string;
//   areaDarkBottom?: string;
// }

interface GraphProps<
  K1 extends keyof ChartPressStateNames,
  K2 extends keyof ChartPressStateNames | undefined = undefined
> {
  cityName: string;
  state: ChartPressState<{
    x: number;
    y: {
      currentLineTop: number;
      currentLineBottom: number;
      currentPosition: number;
    } & Pick<ChartPressStateNames, K1> &
      (K2 extends keyof ChartPressStateNames
        ? Partial<Pick<ChartPressStateNames, K2>>
        : {});
  }>;
  isActive: boolean;
  graphHeight?: number;
  strokeWidth?: number;
  loadedIndex: number;
  apiObjectString: keyof GraphKeyType | (keyof GraphKeyType)[];

  yAxisLabel: string;
  domainBottom?: number;
  domainTop?: number;

  customColor?: Colors;
  customColor2?: Colors;

  addWeatherImages?: boolean | { amount?: number };
  addWeatherText?: boolean | { amount?: number; unit: string };
  removeArea: boolean;
  curveType: CurveType;
  areaDarkTop: string;
  areaDarkBottom: string;
}

const Graph = <Key extends keyof ChartPressStateNames>({
  cityName,
  state,
  isActive,
  graphHeight = 250,
  strokeWidth = 4,
  yAxisLabel,
  loadedIndex,
  apiObjectString,
  domainBottom = 0,
  domainTop = 120,
  customColor = "bgBlue",
  customColor2 = "bgGreen",
  addWeatherImages,
  addWeatherText,
  removeArea = false,
  curveType = "linear",
  areaDarkTop = "rgba(0,0,0,0.2)",
  areaDarkBottom = "rgba(0,0,0,0.3)",
}: GraphProps<Key>) => {
  const data = useWeatherData();
  const { location } = data[cityName];

  const font = getFont();

  // Which y axis key was passed
  const yAxisKey = Object.keys(state.y).filter(
    (key) =>
      key !== "currentLineTop" &&
      key !== "currentLineBottom" &&
      key !== "currentPosition"
  ) as Key[];

  // Get Graph Data
  const graphData = getGraphData(
    data[cityName],
    100,
    0,
    loadedIndex,
    Array.isArray(yAxisKey) ? yAxisKey : [yAxisKey],
    Array.isArray(apiObjectString) ? apiObjectString : [apiObjectString]
  );

  // If addWeatherImages prop included, show defualt 12 images, else take what user typed, else 0
  const imageAmount =
    typeof addWeatherImages === "boolean" ? 12 : addWeatherImages?.amount ?? 0;

  // Display image at the top of graph
  const { timeArr, imageArr } = getGraphImageAndCoord(
    data[cityName],
    loadedIndex,
    imageAmount,
    "condition.code"
  );
  const weatherImageArr = imageArr.map((code, index) =>
    useImage(
      weatherNameToImage(
        getWeatherName(parseInt(code)),
        data[cityName].forecast.forecastday[loadedIndex].hour[timeArr[index]]
          .is_day
      )
    )
  );

  // If addWeatherText prop included, show defualt 12 texts, else take what user typed, else 0
  const textAmount =
    typeof addWeatherText === "boolean" ||
    (addWeatherText?.amount === undefined && addWeatherText?.unit !== undefined)
      ? 12
      : addWeatherText?.amount
      ? addWeatherText.amount
      : 0;

  const textUnit =
    typeof addWeatherText === "boolean" ? "" : addWeatherText?.unit;

  const { timeArr: timeArr2, imageArr: imageArr2 } = getGraphImageAndCoord(
    data[cityName],
    loadedIndex,
    textAmount,
    Array.isArray(apiObjectString) ? apiObjectString[0] : apiObjectString
  );

  return (
    <View style={{ height: graphHeight }} className="relative z-0">
      <CartesianChart
        data={graphData!}
        xKey="hour"
        yKeys={[
          yAxisKey[0],
          yAxisKey[1],
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
          const cutoff = getCurrentHour(location!.tz_id);
          const leftPoints = points[yAxisKey[0]].filter(
            (point) => (point.xValue! as number) <= cutoff
          );
          const rightPoints = points[yAxisKey[0]].filter(
            (point) => (point.xValue! as number) >= cutoff
          );

          const leftPoints2 = points[yAxisKey[1] || yAxisKey[0]].filter(
            (point) => (point.xValue! as number) <= cutoff
          );
          const rightPoints2 = points[yAxisKey[1] || yAxisKey[0]].filter(
            (point) => (point.xValue! as number) >= cutoff
          );

          const graphSize = chartBounds.right - chartBounds.left;

          const imageSize = 18;
          const imageStartOffset = imageSize / 2;
          const textStartOffset = 12 / 2;

          return (
            <>
              {/* Top of graph */}
              <>
                {addWeatherImages &&
                  weatherImageArr.map((img, index) => (
                    <Image
                      key={index}
                      image={img}
                      fit="contain"
                      x={-imageStartOffset + (timeArr[index] / 24) * graphSize}
                      y={10}
                      width={imageSize}
                      height={imageSize}
                    />
                  ))}

                {addWeatherText !== undefined &&
                  imageArr2.map((text, index) => (
                    <Text
                      key={index}
                      x={
                        -textStartOffset / 2 +
                        (timeArr2[index] / 24) * graphSize
                      }
                      y={15}
                      font={font}
                      text={text + textUnit}
                      color={"white"}
                    />
                  ))}
              </>

              {/* Right side of graph*/}
              <>
                {yAxisKey.length > 1 && (
                  <Line
                    points={
                      loadedIndex === 0 ? rightPoints2 : points[yAxisKey[1]]
                    }
                    color={colors[customColor2](0.3)}
                    strokeWidth={6}
                    curveType={curveType}
                  />
                )}

                <Line
                  points={loadedIndex === 0 ? rightPoints : points[yAxisKey[0]]}
                  color={colors[customColor](1)}
                  strokeWidth={6}
                  curveType={curveType}
                />
                {!removeArea && (
                  <Area
                    points={
                      loadedIndex === 0
                        ? rightPoints
                        : points[
                            Array.isArray(yAxisKey) ? yAxisKey[0] : yAxisKey
                          ]
                    }
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
                )}
              </>
              {loadedIndex === 0 && (
                <>
                  {/* Left side of graph*/}
                  <>
                    <Line
                      points={leftPoints2}
                      color={colors[customColor2](0.3)}
                      strokeWidth={6}
                      curveType={curveType}
                    >
                      <DashPathEffect intervals={[10, 10]} />
                    </Line>

                    <Line
                      points={leftPoints}
                      color={colors[customColor](0.6)}
                      strokeWidth={6}
                      curveType={curveType}
                    >
                      <DashPathEffect intervals={[10, 10]} />
                    </Line>

                    {!removeArea && (
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
                    )}
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
                      radius={strokeWidth + 2}
                      style="fill"
                      color="black"
                    />
                    {/* White inner circle */}
                    <Scatter
                      points={points.currentPosition}
                      shape="circle"
                      radius={strokeWidth - 1}
                      style="fill"
                      color="white"
                    />
                  </>
                </>
              )}

              {isActive ? (
                <ToolTip
                  x={state.x.position}
                  y={
                    state.y[Array.isArray(yAxisKey) ? yAxisKey[0] : yAxisKey]
                      .position
                  }
                />
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default Graph;
