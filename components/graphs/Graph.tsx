import { Colors, colors } from "@/assets/colors/colors";
import { ChartPressStateNames } from "@/constants/constants";
import getFont from "@/hooks/getFont";
import { getCurrentHour } from "@/hooks/hooks";
import { useWeatherData } from "@/hooks/useWeatherData";
import {
  AnimatedProp,
  Color,
  Image,
  LinearGradient,
  Path,
  SkImage,
  Text,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";
import {
  runOnUI,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import {
  AreaRange,
  CartesianChart,
  CurveType,
  Line,
  PointsArray,
  useLinePath,
} from "victory-native";
import { currentPrecipExample } from "../averages/utils/constants";
import ToolTip from "../graphs/victoryComponents/Tooltip";
import CurrentPositionCircle from "./CurrentPositionCircle";
import DarkenLeft from "./DarkenLeft";
import DashedLine from "./DashedLine";
import GraphArea from "./GraphArea";
import { ChartPressStateType } from "./utils/constants";
import { getGraphPointsCopy } from "./utils/getGraphPointsCopy";
import VerticalLine from "./VerticalLine";

interface GraphProps {
  cityName: string;
  state: ChartPressStateType;
  isActive: boolean;
  graphHeight?: number;
  strokeWidth?: number;
  loadedIndex: number;
  // apiObjectString: keyof GraphKeyType | (keyof GraphKeyType)[];

  yAxisLabel: string;
  domainBottom?: number;
  domainTop?: number;

  customColor?: Colors;
  customColor2?: Colors;

  removeArea?: boolean;
  removeShade?: boolean;
  removeLine?: boolean;

  innerLeftText?: { top?: string; bottom: string };
  innerRightText?: { top?: string; bottom: string };

  chartImageArrays?: [number[], (SkImage | string)[]];

  curveType?: CurveType;
  // areaDarkTop?: string;
  // areaDarkBottom?: string;

  graphData: {
    mainLine: number | undefined;
    secondLine: number | undefined;
    thirdLine: number | undefined;
    hour: number;
    currentLineTop: number | undefined;
    currentLineBottom: number | undefined;
    currentPosition: number | undefined;
  }[];

  tickValues?: number[];

  areaRange?: AnimatedProp<Color[]>;

  firstLineColor?: any;
  secondLineColor?: any;
  thirdLineColor?: any;

  secondLineDashed?: boolean;

  last30DaysMode?: boolean;
}

const Graph = ({
  cityName,
  state,
  isActive,
  graphHeight = 250,
  strokeWidth = 4,
  yAxisLabel,
  loadedIndex,
  // apiObjectString,
  domainBottom = 0,
  domainTop = 120,
  customColor = "bgBlue",
  customColor2 = "bgGreen",

  removeArea = false,
  removeShade = false,
  removeLine = false,

  innerLeftText,
  innerRightText,

  chartImageArrays,

  // customGraphData,
  graphData,

  curveType = "linear",
  // areaDarkTop = "rgba(0,0,0,0.2)",
  // areaDarkBottom = "rgba(0,0,0,0.3)",

  tickValues = [0, 6, 12, 18, 24],

  areaRange,

  firstLineColor = ["white", "white"],
  secondLineColor = "white",
  thirdLineColor = "white",

  secondLineDashed = false,

  last30DaysMode = false,
}: GraphProps) => {
  const data = useWeatherData();
  const { location } = data[cityName];

  const font = getFont();
  const biggerFont = getFont(30);

  const graphSizeXShared = useSharedValue(0);
  const graphSizeYShared = useSharedValue(0);

  const pressCutoffX = useSharedValue(0);
  const pressCutoffY = useSharedValue(0);

  const xValueCutoff = currentPrecipExample.length - 1;
  // 30 days + 10 extra days on the right
  const xAxisRange = 40;
  const yValueCutoff =
    currentPrecipExample[currentPrecipExample.length - 1].average;
  const yAxisRange = 4;

  useAnimatedReaction(
    () => state.x.position.value,
    (current, previous) => {
      console.log("position changed:", current);
      // console.log("xValue changed:", state.x.value.value);
      // console.log(graphSizeState);
      pressCutoffX.value =
        state.x.value.value > xValueCutoff
          ? graphSizeXShared.value * (xValueCutoff / xAxisRange)
          : current;

      pressCutoffY.value =
        state.x.value.value > xValueCutoff
          ? graphSizeYShared.value * ((yAxisRange - yValueCutoff) / yAxisRange)
          : state.y.mainLine.position.value;
    },
    [state]
  );

  const linearGradientStart = vec(0, 0);
  const linearGradientEnd = vec(0, 200);

  function MyCustomLine({ points }: { points: PointsArray }) {
    // 👇 use the hook to generate a path object.
    const { path } = useLinePath(points, { curveType: "natural" });
    return (
      <Path path={path} style="stroke" strokeWidth={6} color="red">
        <LinearGradient
          start={linearGradientStart}
          end={linearGradientEnd}
          colors={
            Array.isArray(firstLineColor)
              ? firstLineColor
              : [firstLineColor, firstLineColor]
          }
        />
      </Path>
    );
  }

  const yKeys: (
    | "mainLine"
    | "currentLineTop"
    | "currentLineBottom"
    | "currentPosition"
    | "secondLine"
    | "thirdLine"
  )[] = [
    "mainLine",
    "secondLine",
    "thirdLine",
    "currentLineTop",
    "currentLineBottom",
    "currentPosition",
  ];

  const axisOptions = { font, lineWidth: 2 };

  const xAxisOptions = {
    font: font,
    tickValues: tickValues,
    labelColor: "white",
    lineColor: colors.mediumGray,
  };

  const whiteSpaceForMarginLeft = "                              ";
  const formatXLabel = (label: number) =>
    last30DaysMode
      ? label === 0
        ? whiteSpaceForMarginLeft + "Last 30 Days"
        : label === 32
        ? "Today"
        : ""
      : "         " + label.toString();

  return (
    <View style={{ height: graphHeight }} className="relative z-0">
      <CartesianChart
        data={graphData!}
        xKey="hour"
        yKeys={yKeys}
        padding={{ left: 0, right: 20 }} // doesn't affect position outside
        axisOptions={axisOptions}
        xAxis={{
          ...xAxisOptions,
          formatXLabel: formatXLabel,
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

          const { leftPoints, rightPoints, leftPoints2, rightPoints2 } =
            getGraphPointsCopy(points, "mainLine", cutoff);

          const graphSizeX = Math.abs(chartBounds.right - chartBounds.left);
          const graphSizeY = Math.abs(chartBounds.top - chartBounds.bottom);

          runOnUI(() => {
            graphSizeXShared.value = graphSizeX;
            graphSizeYShared.value = graphSizeY;
          })();

          const IMAGE_SIZE = 18;
          const IMAGE_START_OFFSET = IMAGE_SIZE / 2;
          const TEXT_START_OFFSET = 12 / 2;

          const rightLinePoints =
            loadedIndex === 0 && !removeLine ? rightPoints : points.mainLine;

          const rightAreaPoints =
            loadedIndex === 0 ? rightPoints : points.mainLine;

          return (
            <>
              {/* Chart Images on Top of graph */}
              <>
                {chartImageArrays &&
                  (typeof chartImageArrays[1][0] === "string"
                    ? chartImageArrays[1].map((text, index) => (
                        <Text
                          key={index}
                          x={
                            -TEXT_START_OFFSET / 2 +
                            (chartImageArrays[0][index] / 24) * graphSizeX
                          }
                          y={15}
                          font={font}
                          text={text as AnimatedProp<string>}
                          color={"white"}
                        />
                      ))
                    : chartImageArrays[1].map((img, index) => {
                        return (
                          <Image
                            key={index}
                            image={img as SkImage}
                            fit="contain"
                            x={
                              -IMAGE_START_OFFSET +
                              (chartImageArrays[0][index] / 24) * graphSizeX
                            }
                            y={10}
                            width={IMAGE_SIZE}
                            height={IMAGE_SIZE}
                          />
                        );
                      }))}
              </>

              {/* Right side of graph*/}
              <>
                {points.secondLine &&
                  (secondLineDashed ? (
                    <DashedLine
                      points={points.secondLine}
                      color={secondLineColor}
                      curveType={curveType}
                    />
                  ) : (
                    <Line
                      points={points.secondLine}
                      color={secondLineColor}
                      strokeWidth={6}
                      curveType={curveType}
                    />
                  ))}

                {points.thirdLine && (
                  <Line
                    points={points.thirdLine}
                    color={thirdLineColor}
                    strokeWidth={6}
                    curveType={curveType}
                  />
                )}

                {/* Area Range between secondLine and thirdLine */}
                {areaRange && (
                  <AreaRange
                    points={points.mainLine.map((point, index) => ({
                      ...point,
                      y: points.secondLine[index].y ?? 0, // Upper bound
                      y0: points.thirdLine[index].y ?? 0, // Lower bound
                    }))}
                    // y0={50}
                    animate={{ type: "timing", duration: 300 }}
                    // color={colors[customColor](0.6)}
                    curveType={curveType}
                  >
                    <LinearGradient
                      start={linearGradientStart}
                      end={linearGradientEnd}
                      colors={areaRange}
                    />
                  </AreaRange>
                )}

                {/* <Line
                  points={rightLinePoints}
                  color={colors[customColor](1)}
                  strokeWidth={6}
                  curveType={curveType}
                /> */}

                <Line
                  points={rightLinePoints}
                  color={colors.bgWhite(0.2)}
                  strokeWidth={6}
                  curveType={curveType}
                />

                {/* $f42.;2,.<eview?    CustomLine Need to fix to show without linear gradient */}
                <MyCustomLine points={rightLinePoints} />

                {!removeArea && (
                  <GraphArea
                    points={rightAreaPoints}
                    chartBounds={chartBounds}
                    customColor={customColor}
                    curveType={curveType}
                  />
                )}
              </>

              {loadedIndex === 0 && (
                <>
                  {/* Left side of Graph. Dashed Line + Area*/}
                  {!removeLine && (
                    <>
                      <DashedLine
                        points={leftPoints2}
                        color={colors[customColor2](0.3)}
                        curveType={curveType}
                      />
                      <DashedLine
                        points={leftPoints}
                        color={
                          removeShade
                            ? colors[customColor](1)
                            : colors[customColor](0.6)
                        }
                        curveType={curveType}
                      />

                      <GraphArea
                        points={leftPoints}
                        chartBounds={chartBounds}
                        customColor={customColor}
                        curveType={curveType}
                        dark
                      />
                    </>
                  )}

                  {/* Vertical Line */}
                  {!removeLine && (
                    <VerticalLine
                      points={[points.currentLineTop, points.currentLineBottom]}
                      chartBounds={chartBounds}
                    />
                  )}
                  {/* Inner Text */}
                  <>
                    {/* Show inner left text like in Average Modal */}
                    {!isActive && (
                      <>
                        {innerLeftText && innerLeftText.top && (
                          <Text
                            x={10}
                            y={20}
                            font={font}
                            text={innerLeftText.top}
                            color={"white"}
                          />
                        )}
                        {innerLeftText && (
                          <Text
                            x={10}
                            y={innerLeftText?.top ? 50 : 40}
                            font={biggerFont}
                            text={innerLeftText.bottom}
                            color={"white"}
                          />
                        )}
                      </>
                    )}

                    {/* Show inner left text like in Average Modal */}
                    {!isActive && (
                      <>
                        {innerRightText && innerRightText.top && (
                          <Text
                            x={10}
                            y={20}
                            font={font}
                            text={innerRightText.top}
                            color={"white"}
                          />
                        )}
                        {innerRightText && (
                          <Text
                            x={chartBounds.right - 80}
                            y={innerRightText?.top ? 50 : 40}
                            font={biggerFont}
                            text={innerRightText.bottom}
                            color={"white"}
                          />
                        )}
                      </>
                    )}
                  </>

                  {/* Removing this caused issues so instead made invisible */}
                  <DarkenLeft
                    points={leftPoints}
                    chartBounds={chartBounds}
                    removeShade={removeShade}
                    curveType={curveType}
                  />

                  <CurrentPositionCircle
                    points={points.currentPosition}
                    strokeWidth={strokeWidth}
                  />
                </>
              )}

              {isActive ? (
                <ToolTip
                  x={pressCutoffX}
                  y={pressCutoffY}

                  // x={state.x.position}
                  // y={state.y.mainLine.position}
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
