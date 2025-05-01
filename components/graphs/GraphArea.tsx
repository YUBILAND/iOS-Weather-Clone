import { View, Text } from "react-native";
import React from "react";
import { Area, ChartBounds, CurveType, PointsArray } from "victory-native";
import { colors, Colors } from "@/assets/colors/colors";
import { LinearGradient, vec } from "@shopify/react-native-skia";

interface GraphAreaProps {
  points: PointsArray;
  chartBounds: ChartBounds;
  customColor: Colors;
  curveType: CurveType;
  dark?: boolean;
}

const GraphArea = ({
  points,
  chartBounds,
  customColor,
  curveType,
  dark,
}: GraphAreaProps) => {
  return (
    <Area
      points={points}
      y0={chartBounds.bottom}
      animate={{ type: "timing", duration: 300 }}
      color={dark ? colors[customColor](0.6) : colors[customColor](1)}
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
  );
};

{
  /* <Area
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
                  </Area> */
}

export default GraphArea;
