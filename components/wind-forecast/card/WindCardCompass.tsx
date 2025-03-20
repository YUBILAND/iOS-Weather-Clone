import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../../atoms/DefaultText";
import HorizontalLine from "../../atoms/HorizontalLine";

interface WindCardCompassProps {
  data: WeatherData;
}

const WindCardCompass = ({ data }: WindCardCompassProps) => {
  const rotationDegrees = (data.current.wind_degree + 90).toString() + "deg";
  return (
    <View className="items-center ">
      <View
        className="w-32 h-32 relative max-w-32"
        style={{ borderRadius: "50%", backgroundColor: colors.lightGray }}
      >
        <DefaultText
          style={{
            position: "absolute",
            color: "black",
            fontSize: 20,
            left: "43%",
            top: 0,
          }}
        >
          N
        </DefaultText>

        <DefaultText
          style={{
            position: "absolute",
            color: "black",
            fontSize: 20,
            left: "43%",
            bottom: 0,
          }}
        >
          S
        </DefaultText>

        <DefaultText
          style={{
            position: "absolute",
            color: "black",
            fontSize: 20,
            left: 2,
            top: "40%",
          }}
        >
          W
        </DefaultText>

        <DefaultText
          style={{
            position: "absolute",
            color: "black",
            fontSize: 20,
            right: 5,
            top: "40%",
          }}
        >
          E
        </DefaultText>

        <View
          className="absolute top-[50%] left-0 w-full"
          style={{ transform: [{ rotate: rotationDegrees }] }}
        >
          <View className="flex-row  ">
            <View className="w-[80%] ml-4">
              <HorizontalLine color="black" size={5}>
                <View className="absolute top-[-10px] right-0">
                  <View
                    className="w-5 h-5 bg-black "
                    style={{ borderRadius: "50%" }}
                  />
                </View>
              </HorizontalLine>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WindCardCompass;
