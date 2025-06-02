import { Colors, colors } from "@/assets/colors/colors";
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
  SkPoint,
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
import {
  ChartDomainType,
  ChartPressStateType,
  ChartPressStateY,
} from "./utils/constants";
import { getGraphPointsCopy } from "./utils/getGraphPointsCopy";
import VerticalLine from "./VerticalLine";
import { YAxisInputProps } from "victory-native/dist/types";

type LineColors = {
  firstLineColor?: any;
  secondLineColor?: any;
  thirdLineColor?: any;
};

type GraphStyling = {
  customColor?: Colors;
  customColor2?: Colors;
  strokeWidth?: number;
  graphHeight?: number;
  areaRange?: AnimatedProp<Color[]>;
  secondLineDashed?: boolean;
  curveType?: CurveType;
};

type InnerText = { top?: string; bottom: string };

type SideText = {
  innerLeftText?: InnerText;
  innerRightText?: InnerText;
};

type GraphDisplayToggles = {
  removeArea?: boolean;
  removeShade?: boolean;
  removeLine?: boolean;
};

type GraphSettings = {
  graphData: ChartPressStateY[];
  yAxisLabel: string;
  domainBottom?: number;
  domainTop?: number;
  chartImageArrays?: [number[], (SkImage | string)[]];
  tickValues?: number[];
  last30DaysMode?: boolean;
};

type yKeysType =
  | "mainLine"
  | "currentLineTop"
  | "currentLineBottom"
  | "currentPosition"
  | "secondLine"
  | "thirdLine";

interface GraphProps
  extends LineColors,
    GraphStyling,
    SideText,
    GraphDisplayToggles,
    GraphSettings {
  cityName: string;
  state: ChartPressStateType;
  isActive: boolean;
  loadedIndex: number;
}

const Graph = (props: GraphProps) => {
  // GraphDisplayToggles
  const { removeArea = false, removeShade = false, removeLine = false } = props;

  // GraphSettings
  const {
    graphData,
    yAxisLabel,
    domainBottom = 0,
    domainTop = 120,
    chartImageArrays,
    tickValues = [0, 6, 12, 18, 24],
    last30DaysMode = false,
  } = props;

  // SideText
  const { innerLeftText, innerRightText } = props;

  // LineColors
  const {
    firstLineColor = ["white", "white"],
    secondLineColor = "white",
    thirdLineColor = "white",
  } = props;

  // GraphStyling
  const {
    customColor = "bgBlue",
    customColor2 = "bgGreen",
    strokeWidth = 4,
    graphHeight = 250,
    areaRange,
    secondLineDashed = false,
    curveType = "linear",
  } = props;

  const { cityName, state, isActive, loadedIndex } = props;

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
      // console.log("position changed:", current);
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

  const yKeys: yKeysType[] = [
    "mainLine",
    "secondLine",
    "thirdLine",
    "currentLineTop",
    "currentLineBottom",
    "currentPosition",
  ];

  const whiteSpaceForMarginLeft = "                              ";
  const formatXLabel = (label: number) =>
    last30DaysMode
      ? label === 0
        ? whiteSpaceForMarginLeft + "Last 30 Days"
        : label === 32
        ? "Today"
        : ""
      : "         " + label.toString();

  const axisOptions = { font, lineWidth: 2 };
  const xAxisOptions = {
    font: font,
    tickValues: tickValues,
    labelColor: "white",
    lineColor: colors.mediumGray,
    formatXLabel: formatXLabel,
  };
  const yAxisOptions: YAxisInputProps<ChartPressStateY, yKeysType> = {
    formatYLabel: (label) => label + yAxisLabel,
    font: font,
    axisSide: "right",
    labelColor: "white",
    lineColor: colors.mediumGray,
  };

  const domainY: ChartDomainType = {
    y: [domainBottom, domainTop],
  };

  const CartesianChartProps = {
    data: graphData!,
    xKey: "hour" as const,
    yKeys: yKeys,
    padding: { left: 0, right: 20 }, // doesn't affect position outside
    axisOptions,
    xAxis: xAxisOptions,
    yAxis: [yAxisOptions],
    domain: domainY,
    chartPressState: state,
  };

  return (
    <View style={{ height: graphHeight }} className="relative z-0">
      <CartesianChart {...CartesianChartProps}>
        {({ points, chartBounds }) => {
          const cutoff = getCurrentHour(location!.tz_id);

          const { leftPoints, rightPoints, leftPoints2, rightPoints2 } =
            getGraphPointsCopy(points, "mainLine", cutoff);

          const getGraphSize = () => {
            const graphSizeX = Math.abs(chartBounds.right - chartBounds.left);
            const graphSizeY = Math.abs(chartBounds.top - chartBounds.bottom);
            return { graphSizeX, graphSizeY };
          };
          const { graphSizeX, graphSizeY } = getGraphSize();

          runOnUI(() => {
            graphSizeXShared.value = graphSizeX;
            graphSizeYShared.value = graphSizeY;
          })();

          const IMAGE_SIZE = 18;
          const IMAGE_START_OFFSET = IMAGE_SIZE / 2;
          const TEXT_START_OFFSET = 12 / 2;

          const getRightPoints = () => {
            const rightLinePoints =
              loadedIndex === 0 && !removeLine ? rightPoints : points.mainLine;
            const rightAreaPoints =
              loadedIndex === 0 ? rightPoints : points.mainLine;
            return { rightLinePoints, rightAreaPoints };
          };
          const { rightLinePoints, rightAreaPoints } = getRightPoints();

          const TextOverlay = () => {
            const timeArr = chartImageArrays![0];
            const textArr = chartImageArrays![1];

            return textArr.map((text, index) => {
              const xPosition =
                -TEXT_START_OFFSET / 2 + (timeArr[index] / 24) * graphSizeX;
              return (
                <Text
                  key={index}
                  x={xPosition}
                  y={15}
                  font={font}
                  text={text as AnimatedProp<string>}
                  color={"white"}
                />
              );
            });
          };

          const ImageOverlay = () => {
            const timeArr = chartImageArrays![0];
            const imageArr = chartImageArrays![1];
            return imageArr.map((img, index) => {
              const xPosition =
                -IMAGE_START_OFFSET + (timeArr[index] / 24) * graphSizeX;
              return (
                <Image
                  key={index}
                  image={img as SkImage}
                  fit="contain"
                  x={xPosition}
                  y={10}
                  width={IMAGE_SIZE}
                  height={IMAGE_SIZE}
                />
              );
            });
          };

          const DisplayOverlay = () => {
            const arrIsString = typeof chartImageArrays![1][0] === "string";
            return arrIsString ? <TextOverlay /> : <ImageOverlay />;
          };

          const ShowSecondLine = () => {
            return secondLineDashed ? (
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
            );
          };

          const ShowThirdLine = () => {
            return (
              <Line
                points={points.thirdLine}
                color={thirdLineColor}
                strokeWidth={6}
                curveType={curveType}
              />
            );
          };

          const ShowAreaRange = () => {
            return (
              <AreaRange
                points={points.mainLine.map((point, index) => ({
                  ...point,
                  y: points.secondLine[index].y ?? 0, // Upper bound
                  y0: points.thirdLine[index].y ?? 0, // Lower bound
                }))}
                curveType={curveType}
              >
                <LinearGradient
                  start={linearGradientStart}
                  end={linearGradientEnd}
                  colors={areaRange as AnimatedProp<Color[]>}
                />
              </AreaRange>
            );
          };

          const {
            secondLine,
            thirdLine,
            currentLineTop,
            currentLineBottom,
            currentPosition,
          } = points;

          const RightLine = () => {
            return (
              <Line
                points={rightLinePoints}
                color={colors.bgWhite(0.2)}
                strokeWidth={6}
                curveType={curveType}
              />
            );
          };

          const CustomLineProps = {
            points: rightLinePoints,
            colors: firstLineColor,
            linearGradientDirection: {
              start: linearGradientStart,
              end: linearGradientEnd,
            },
          };

          const ShowGraphArea = () => {
            return (
              <GraphArea
                points={rightAreaPoints}
                chartBounds={chartBounds}
                customColor={customColor}
                curveType={curveType}
              />
            );
          };

          const ShowLeftLine = () => {
            return (
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
            );
          };

          const ShowVerticalLine = () => {
            return (
              <VerticalLine
                points={[currentLineTop, currentLineBottom]}
                chartBounds={chartBounds}
              />
            );
          };

          const ShowInnerLeftText = () => {
            return (
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
            );
          };

          const ShowInnerRightText = () => {
            return (
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
            );
          };

          const DarkenLeftProps = {
            points: leftPoints,
            chartBounds,
            removeShade,
            curveType,
          };

          const CurrentPositionCircleProps = {
            points: currentPosition,
            strokeWidth,
          };

          return (
            <>
              {/* Chart Images on Top of graph */}
              {chartImageArrays && <DisplayOverlay />}
              <>
                {secondLine && <ShowSecondLine />}

                {thirdLine && <ShowThirdLine />}

                {/* Area Range between secondLine and thirdLine */}
                {areaRange && <ShowAreaRange />}

                <RightLine />

                <MyCustomLine {...CustomLineProps} />

                {!removeArea && <ShowGraphArea />}
              </>
              {loadedIndex === 0 && (
                <>
                  {!removeLine && <ShowLeftLine />}

                  {!removeLine && <ShowVerticalLine />}
                  <>
                    {!isActive && <ShowInnerLeftText />}
                    {!isActive && <ShowInnerRightText />}
                  </>

                  <DarkenLeft {...DarkenLeftProps} />

                  <CurrentPositionCircle {...CurrentPositionCircleProps} />
                </>
              )}
              {isActive ? <ToolTip x={pressCutoffX} y={pressCutoffY} /> : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

function MyCustomLine({
  points,
  colors,
  linearGradientDirection,
}: {
  points: PointsArray;
  colors: Color | Color[];
  linearGradientDirection: { start: SkPoint; end: SkPoint };
}) {
  // 👇 use the hook to generate a path object.
  const { path } = useLinePath(points, { curveType: "natural" });
  const { start, end } = linearGradientDirection;
  return (
    <Path path={path} style="stroke" strokeWidth={6} color="red">
      <LinearGradient
        start={start}
        end={end}
        colors={Array.isArray(colors) ? colors : [colors, colors]}
      />
    </Path>
  );
}

export default Graph;
