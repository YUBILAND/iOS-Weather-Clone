import { colors } from "@/assets/colors/colors";
import {
  Group,
  Mask,
  Rect,
  Image as SkiaImage,
  SkImage,
  useFont,
  useImage,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Area,
  CartesianChart,
  ChartPressState,
  Viewport,
} from "victory-native";
import SpaceMono from "../../assets/fonts/SpaceMono-Regular.ttf";
import DefaultText from "../atoms/DefaultText";

import { MoonPhase } from "./utils/constants";
import { getMoonGraphLumin } from "./utils/getMoonGraphLumin";
import { getMoonPhaseGraphData } from "./utils/getMoonPhaseGraphData";
import { getMoonRotationDegress } from "./utils/getMoonRotationDegrees";
import { getRemoveAnimationRef } from "./utils/getRemoveAnimationRef";
import { getCustomMoonPercentage } from "./utils/getCustomMoonPercentage";
import { SidedNumber } from "victory-native/dist/types";
import { ChartDomainType } from "../graphs/utils/constants";
import { PathAnimationConfig } from "victory-native/dist/hooks/useAnimatedPath";

type MoonGraphState = ChartPressState<{
  x: number;
  y: {
    moonPath: number;
    sunPosition: number;
    phaseLine: number;
  };
}>;

type ScrollDetails = {
  initialScrollIndex: number;
  userScrolledIndex: number;
};

type GraphSettings = {
  graphHeight: number;
  addLines?: boolean;
  scaleDown?: number;
  showPercent?: boolean;
  currentMoonPhase: MoonPhase;
};

interface MoonPhaseGraphProps extends ScrollDetails, GraphSettings {
  cityName: string;
  state: MoonGraphState;
}

const MoonPhaseGraph = (props: MoonPhaseGraphProps) => {
  const { cityName, state } = props;

  // ScrollDetails
  const { initialScrollIndex, userScrolledIndex } = props;

  // GraphSettings
  const {
    graphHeight,
    addLines = false,
    currentMoonPhase,
    scaleDown = 0,
    showPercent = false,
  } = props;

  const font = useFont(SpaceMono, 12);

  const halfSize = -scaleDown;

  const xAxisOptions = {
    font: addLines ? font : null,
    labelColor: addLines ? colors.lightGray : "transparent",
    lineColor: addLines ? "white" : "transparent",
  };
  const yAxisOptions = [
    {
      font: addLines ? font : null,
      labelColor: addLines ? colors.lightGray : "transparent",
      lineColor: addLines ? "white" : "transparent",
    },
  ];

  const moonGraphLumin = getMoonGraphLumin(
    userScrolledIndex - initialScrollIndex
  );
  const MoonPhaseData = useMemo(() => {
    return getMoonPhaseGraphData(moonGraphLumin);
  }, [moonGraphLumin]);
  const CartesianChartProps = {
    data: MoonPhaseData,
    xKey: "day" as const,
    yKeys: ["moonPath", "sunPosition", "phaseLine"] as YKeysType,
    xAxis: xAxisOptions,
    yAxis: yAxisOptions,
    viewport: { x: [-7.5, 7.5] } as Viewport,
    domain: { y: [-10, 10] } as ChartDomainType,
    padding: {
      bottom: addLines ? 10 : -8,
      left: addLines ? 0 : -4,
    } as SidedNumber,
  };

  const customMoonPercentage = getCustomMoonPercentage(
    currentMoonPhase,
    moonGraphLumin
  );
  const ShowPercentage = () => {
    return (
      <View className="absolute w-full items-start">
        <DefaultText className="font-bold text-4xl">
          {customMoonPercentage}
        </DefaultText>
      </View>
    );
  };

  const moonSizeStyle = {
    height: 260 + halfSize,
    width: 260 + halfSize,
  };

  const moonRotation = getMoonRotationDegress(currentMoonPhase, moonGraphLumin);
  const moonRotateStyle = {
    transform: [{ rotate: moonRotation + "deg" }],
  };

  // Remove Animation when transitioning in reverse to prevent flicker
  const removeAnimationRef = getRemoveAnimationRef(currentMoonPhase);

  const moonImage = useImage(require("../../assets/images/moon.png"));
  if (!moonImage) return null;

  return (
    <>
      {showPercent && <ShowPercentage />}

      <View style={moonSizeStyle}>
        <View style={[styles.moonStaticStyle, moonRotateStyle]}>
          <CartesianChart {...CartesianChartProps}>
            {({ points, chartBounds, canvasSize }) => {
              const MOON_IMAGE_SIZE = addLines
                ? 230 + halfSize
                : 260 + halfSize;

              const getMoonCenter = () => {
                // Graph overflows a bit on the right so when rotated is offset to the right. Add some right padding to recenter it
                const GRAPH_XPADDING_TO_RECENTER = addLines ? 12 : 0;
                const GRAPH_YPADDING_TO_RECENTER = addLines ? 14 : 0;
                const moonCenterX =
                  canvasSize.width / 2 +
                  GRAPH_XPADDING_TO_RECENTER -
                  MOON_IMAGE_SIZE / 2;
                const moonCenterY =
                  canvasSize.height / 2 -
                  GRAPH_YPADDING_TO_RECENTER -
                  MOON_IMAGE_SIZE / 2;
                return { moonCenterX, moonCenterY };
              };
              const { moonCenterX, moonCenterY } = getMoonCenter();

              const MoonShadow = () => {
                // Remove Animation when transitioning in reverse to prevent flicker
                const removeAnimationRef =
                  getRemoveAnimationRef(currentMoonPhase);
                return (
                  <Area
                    points={points.moonPath}
                    y0={
                      // don't change this because it designates the direction of the shadow
                      currentMoonPhase === "waxing"
                        ? chartBounds.bottom
                        : chartBounds.top
                    }
                    color={colors.bgBlack(0.8)}
                    animate={{
                      type: "timing",
                      duration: removeAnimationRef.current ? 0 : 300,
                    }}
                  />
                );
              };

              const MoonShadowProps = {
                points: points.moonPath,
                y0:
                  // don't change this because it designates the direction of the shadow
                  currentMoonPhase === "waxing"
                    ? chartBounds.bottom
                    : chartBounds.top,
                color: colors.bgBlack(0.8),
              };

              const MoonImage = () => {
                return (
                  <SkiaImage
                    image={moonImage}
                    rect={{
                      x: moonCenterX,
                      y: moonCenterY,
                      width: MOON_IMAGE_SIZE,
                      height: MOON_IMAGE_SIZE,
                    }}
                  />
                );
              };

              const OverlayMoon = () => {
                return (
                  <Rect
                    x={0}
                    y={0}
                    width={256}
                    height={256}
                    color={colors.bgWhite(1)}
                  />
                );
              };

              const MoonShadowAnimated: PathAnimationConfig = {
                type: "timing",
                duration: removeAnimationRef.current ? 0 : 300,
              };

              return (
                <>
                  <Mask
                    mode="luminance"
                    mask={
                      <Group>
                        <MoonImage />
                        <Area
                          {...MoonShadowProps}
                          animate={MoonShadowAnimated}
                        />
                      </Group>
                    }
                    children={<OverlayMoon />}
                  />
                </>
              );
            }}
          </CartesianChart>
        </View>
      </View>
    </>
  );
};
type YKeysType = ("moonPath" | "sunPosition" | "phaseLine")[];

const styles = StyleSheet.create({
  moonStaticStyle: {
    height: "100%",
    width: "100%",
  },
});

const rerenderMoonImage = (moonImage: SkImage | null) => {
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    if (moonImage) {
      setUpdate((prev) => !prev);
    }
  }, [moonImage]);
};

export default React.memo(MoonPhaseGraph);
