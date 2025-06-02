import { Colors, colors } from "@/assets/colors/colors";
import { ChartPressStateNames } from "@/constants/constants";
import getFont from "@/hooks/getFont";
import { getCurrentHour } from "@/hooks/hooks";
import { useWeatherData } from "@/hooks/useWeatherData";
import {
  AnimatedProp,
  Color,
  DashPathEffect,
  Image,
  LinearGradient,
  Path,
  Skia,
  SkImage,
  Text,
  useFont,
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
  Bar,
  CartesianChart,
  ChartPressState,
  CurveType,
  Line,
  PointsArray,
  useLinePath,
} from "victory-native";
import { currentPrecipExample } from "../averages/utils/constants";
import ToolTip from "../graphs/victoryComponents/Tooltip";
import { ChartPressStateType } from "../graphs/utils/constants";
import { BarChartPressStateType } from "./utils/constants";
import Roboto from "../../assets/fonts/Roboto-Regular.ttf";
import RenderXAxisOutside from "./RenderXAxisOutside";
import YAxisText from "./YAxisText";
import { XAxisInputProps, YAxisInputProps } from "victory-native/dist/types";

interface GraphProps {
  cityName: string;
  state: BarChartPressStateType;
  isActive: boolean;
  graphHeight?: number;
  strokeWidth?: number;
  yAxisLabel?: string;
  domainBottom?: number;
  domainTop?: number;

  customColor?: Colors;
  customColor2?: Colors;

  innerLeftText?: { top?: string; bottom: string };

  graphData: {
    mainBar: number;
    minute: number;
  }[];

  tickValuesX?: number[];
  tickValuesY?: number[];

  cardMode?: boolean;
}

const Graph = ({
  cityName,
  state,
  isActive,
  graphData,

  domainBottom = 0,
  domainTop = 120,
  graphHeight = 250,
  strokeWidth = 4,
  yAxisLabel = "",
  innerLeftText,
  tickValuesX = [0, 10, 20, 30, 40, 50, 60],
  tickValuesY = [0, 1.5, 3, 4.5],

  cardMode = false,
}: GraphProps) => {
  const data = useWeatherData();
  const { location } = data[cityName];

  const font = useFont(Roboto, 14);

  const xAxisOptions: XAxisInputProps<
    {
      mainBar: number;
      minute: number;
    },
    "minute"
  > = {
    font: font,
    tickValues: tickValuesX,
    labelColor: "white",
    lineColor: "white",
    formatXLabel: (label) => "",
    linePathEffect: <DashPathEffect intervals={[4, 4]} />,
  };

  const yAxisOptions: YAxisInputProps<
    {
      mainBar: number;
      minute: number;
    },
    "mainBar"
  > = {
    formatYLabel: (label) => "",
    font: font,
    labelPosition: "inset",
    axisSide: "left",
    labelColor: "white",
    lineColor: "white",
    tickValues: tickValuesY,
    linePathEffect: <DashPathEffect intervals={[4, 4]} />,
  };

  const pressCutoffX = useSharedValue(0);
  const pressCutoffY = useSharedValue(0);

  const xValueCutoff = graphData.length - 1;
  // 30 days + 10 extra days on the right
  const xAxisRange = 40;
  const yValueCutoff =
    currentPrecipExample[currentPrecipExample.length - 1].average;
  const yAxisRange = 4;

  const graphSizeXShared = useSharedValue(0);
  const graphSizeYShared = useSharedValue(0);

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
          : state.y.mainBar.position.value;
    },
    [state]
  );

  return (
    <View style={{ height: graphHeight }} className="relative z-0">
      <CartesianChart
        data={graphData!}
        xKey="minute"
        yKeys={["mainBar"]}
        xAxis={xAxisOptions}
        yAxis={[yAxisOptions]}
        domain={{ y: [domainBottom, domainTop] }}
        chartPressState={state}
        renderOutside={({ chartBounds }) => (
          <RenderXAxisOutside
            chartBounds={chartBounds}
            tickValuesX={tickValuesX}
          />
        )}
      >
        {({ points, chartBounds }) => {
          const graphSizeX = Math.abs(chartBounds.right - chartBounds.left);
          const graphSizeY = Math.abs(chartBounds.top - chartBounds.bottom);

          // Sync graphSize to shared value
          runOnUI(() => {
            graphSizeXShared.value = graphSizeX;
            graphSizeYShared.value = graphSizeY;
          })();

          return (
            <>
              <Bar
                chartBounds={chartBounds} // 👈 chartBounds is needed to know how to draw the bars
                points={points.mainBar}
                color={"lightblue"}
              />
              {!cardMode && <YAxisText graphSizeY={graphSizeY} />}

              {!cardMode && isActive ? (
                <ToolTip x={pressCutoffX} y={pressCutoffY} />
              ) : null}
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

export default Graph;
