import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import React, { useState } from "react";
import { View, Image, ImageSourcePropType } from "react-native";
import DefaultText from "../../atoms/DefaultText";
import HorizontalLine from "../../atoms/HorizontalLine";
import Svg, { Circle, Ellipse, G, Polygon, Rect, Text } from "react-native-svg";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { getOddPressureDirectionImages } from "@/components/air-pressure/utils/getOddPressureDirectionImages";

interface WindCardCompassProps {
  data: WeatherData;
}

const WindCardCompass = ({ data }: WindCardCompassProps) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const onLayout = (event: {
    nativeEvent: { layout: { width: any; height: any } };
  }) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const rotationDegrees = data.current.wind_degree + 180;

  const currentWindDirection = data.current.wind_dir;

  const circleProgressWidth = 10;

  const triangleHeight = circleProgressWidth / 2;
  const triangleWidth = circleProgressWidth;

  const tailWidth = 3;
  const tailHeight = 20;

  const tailCircleRadius = 5;

  const extraPadding = 4;

  const OutsideTicks = () => {
    return Array(90)
      .fill(0)
      .map((_, index) => {
        return (
          <G
            key={index}
            x={layout.width / 2 - extraPadding * 4}
            y={layout.height / 2}
            rotation={index * 4}
          >
            <Rect
              x={-(tailWidth / 2)}
              y={-(layout.height / 2) + extraPadding}
              width={1}
              height={10}
              fill="gray"
              stroke={"transparent"}
            />
          </G>
        );
      });
  };

  return (
    <View className="items-center" onLayout={onLayout}>
      <AnimatedCircularProgress
        rotation={0}
        size={115}
        width={circleProgressWidth}
        fill={0}
        lineCap="square"
        tintColor="transparent"
        backgroundColor="transparent"
        padding={extraPadding}
        renderCap={({ center }) => {
          return (
            <>
              <Svg height={1000} width={1000}>
                <OutsideTicks />

                {/* Compass Direction Letters */}
                <>
                  {/* N Letter */}
                  <Text
                    x={layout.width / 2 - extraPadding * 4 - 4}
                    y={layout.height / 2 - 30}
                    fontWeight={700}
                    fill="white"
                    stroke={"transparent"}
                  >
                    N
                  </Text>

                  {/* E Letter */}
                  <Text
                    x={layout.width / 2 - extraPadding * 4 + 30}
                    y={layout.height / 2 + 4}
                    fontWeight={700}
                    fill="white"
                    stroke={"transparent"}
                  >
                    E
                  </Text>

                  {/* W Letter */}
                  <Text
                    x={layout.width / 2 - extraPadding * 4 - 8 - 30}
                    y={layout.height / 2 + 4}
                    fontWeight={700}
                    fill="white"
                    stroke={"transparent"}
                  >
                    W
                  </Text>

                  {/* S Letter */}
                  <Text
                    x={layout.width / 2 - extraPadding * 4 - 4}
                    y={layout.height / 2 + 8 + 30}
                    fontWeight={700}
                    fill="white"
                    stroke={"transparent"}
                  >
                    S
                  </Text>
                </>

                {/* North Gray Arrow */}
                <G
                  x={layout.width / 2 - extraPadding * 4}
                  y={layout.height / 2}
                >
                  <Polygon
                    points={`0,${-circleProgressWidth / 2} ${-(
                      triangleWidth / 2
                    )},${triangleHeight} ${
                      triangleWidth / 2
                    },${triangleHeight}`}
                    fill="lightgray"
                    x={0}
                    y={-(layout.height / 2) + extraPadding + triangleHeight}
                  />
                </G>

                {/* East Gray Arrow */}
                <G
                  x={layout.width / 2 - extraPadding * 4}
                  y={layout.height / 2}
                  rotation={90}
                >
                  <Rect
                    x={-(tailWidth / 2)}
                    y={-(layout.height / 2) + extraPadding}
                    width={3}
                    height={10}
                    fill="lightgray"
                    stroke={"transparent"}
                  />
                </G>

                {/* South Gray Arrow */}
                <G
                  x={layout.width / 2 - extraPadding * 4}
                  y={layout.height / 2}
                  rotation={180}
                >
                  <Rect
                    x={-(tailWidth / 2)}
                    y={-(layout.height / 2) + extraPadding}
                    width={3}
                    height={10}
                    fill="lightgray"
                    stroke={"transparent"}
                  />
                </G>

                {/* West Gray Arrow */}
                <G
                  x={layout.width / 2 - extraPadding * 4}
                  y={layout.height / 2}
                  rotation={270}
                >
                  <Rect
                    x={-(tailWidth / 2)}
                    y={-(layout.height / 2) + extraPadding}
                    width={3}
                    height={10}
                    fill="lightgray"
                    stroke={"transparent"}
                  />
                </G>

                {/* Arrow  */}
                <G
                  rotation={rotationDegrees}
                  x={layout.width / 2 - extraPadding * 4}
                  y={layout.height / 2}
                >
                  {/* Arrow Head Triangle */}
                  <Polygon
                    points={`0,${-circleProgressWidth / 2} ${-(
                      triangleWidth / 2
                    )},${triangleHeight} ${
                      triangleWidth / 2
                    },${triangleHeight}`}
                    fill="white"
                    x={0}
                    y={-(layout.height / 2) + extraPadding + triangleHeight}
                  />

                  {/* Arrow Stick Connected to Head*/}
                  <Rect
                    x={-(tailWidth / 2)}
                    y={
                      -(layout.height / 2) + extraPadding + circleProgressWidth
                    }
                    width={tailWidth}
                    height={tailHeight}
                    fill="white"
                    stroke={"transparent"}
                  />

                  {/* Arrow Tail Stick */}
                  <Rect
                    x={-(tailWidth / 2)}
                    y={25}
                    width={tailWidth}
                    height={tailHeight}
                    fill="white"
                    stroke={"transparent"}
                  />
                  {/* Arrow Tail Circle */}
                  <Ellipse
                    cx="0"
                    cy={50}
                    rx={tailCircleRadius}
                    ry={tailCircleRadius}
                    stroke="white"
                    strokeWidth="3"
                    fill="transparent"
                  />
                </G>
              </Svg>
            </>
          );
        }}
      >
        {() => (
          <View className="items-center">
            <DefaultText style={{ fontSize: 20, fontWeight: 800 }}>
              {currentWindDirection}
            </DefaultText>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default WindCardCompass;
