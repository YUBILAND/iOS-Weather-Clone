import React, { useState } from "react";
import { View, Text, Image, ColorValue, Pressable } from "react-native";
import DefaultText from "../atoms/DefaultText";
import { Ionicons } from "@expo/vector-icons";
import { dayCodeToImg } from "@/utils/exampleForecast";
import { shadowViewStyle } from "../location-modal/unit-modal/MyOverflowMenu";
import { getTemperature } from "@/hooks/useDisplayUnits";

const Temperature = ({
  temperature,
  fontSize,
}: {
  temperature: string;
  fontSize: number;
}) => (
  <DefaultText style={{ fontWeight: 700, fontSize: fontSize }}>
    {temperature}
  </DefaultText>
);

const WeatherImage = ({ imageName }: { imageName: string }) => (
  <Image
    source={dayCodeToImg[imageName]}
    style={{ width: 25, height: 25, tintColor: "white" }}
  />
);

const TrianglePin = ({
  width,
  iconSize,
  color,
}: {
  width: number;
  iconSize: number;
  color: ColorValue;
}) => (
  <View
    style={{
      position: "absolute",
      top: "100%",
      left: width / 2 - iconSize / 2,
      transform: [{ rotate: "180deg" }],
    }}
  >
    <Ionicons
      name="triangle"
      size={iconSize}
      color={color}
      style={{
        zIndex: 1,
        alignSelf: "flex-start",
      }}
    />
  </View>
);

interface CustomMarkerProps {
  temperature: number;
  weatherImageName: string;
  outerColor: ColorValue;
  innerColor: ColorValue;
  active?: boolean;
  pressMarker: () => void;
  markerSize: "big" | "small";
}

const CustomMarker = ({
  temperature,
  weatherImageName,
  outerColor,
  innerColor,
  active = false,
  pressMarker,
  markerSize,
}: CustomMarkerProps) => {
  const width = 70;
  const smallWidth = 40;

  const ICON_SIZE = 18;
  const activeBorderWidth = 4;
  const inactiveBorderWidth = 2;

  const activeFontSize = 20;
  const inactiveFontSize = 16;

  //   Extra rerender fixes the dynamic render issue
  //   const [newActive, setNewActive] = useState(false);

  return (
    <>
      {markerSize === "small" ? (
        <View
          className="relative "
          style={{
            width: 20,
            height: 20,
            //   marginBottom:
            //     (active ? width : smallWidth) + (active ? ICON_SIZE : 0),
          }}
        >
          <Pressable
            onPress={() => {
              //   setNewActive((prev) => !prev)
              pressMarker();
              //   console.log("pressed")
            }}
            style={[
              shadowViewStyle,
              {
                position: "absolute",
                left: 0,
                width: 20,
                height: 20,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: outerColor,
                backgroundColor: innerColor,
              },
            ]}
          ></Pressable>
        </View>
      ) : (
        <View
          className="relative "
          style={{
            width: active ? width : smallWidth,
            height: (active ? width : smallWidth) + (active ? ICON_SIZE : 0),
            marginBottom:
              (active ? width : smallWidth) + (active ? ICON_SIZE : 0),
          }}
        >
          <Pressable
            onPress={() => {
              //   setNewActive((prev) => !prev)
              pressMarker();
              //   console.log("pressed")
            }}
            style={[
              shadowViewStyle,
              {
                position: "absolute",
                left: 0,
                width: active ? width : smallWidth,
                height: active ? width : smallWidth,
                borderRadius: 100,
                borderWidth: active ? activeBorderWidth : inactiveBorderWidth,
                borderColor: outerColor,
                backgroundColor: innerColor,
              },
            ]}
          >
            <View className="flex-col items-center justify-center w-full h-full relative ">
              <Temperature
                temperature={Math.round(getTemperature(temperature)) + "°"}
                fontSize={active ? activeFontSize : inactiveFontSize}
              />
              {active && <WeatherImage imageName={weatherImageName} />}

              {active && (
                <TrianglePin
                  width={width - activeBorderWidth * 2}
                  iconSize={ICON_SIZE}
                  color={outerColor}
                />
              )}
            </View>
          </Pressable>
        </View>
      )}
    </>
  );
};

export default React.memo(CustomMarker);
