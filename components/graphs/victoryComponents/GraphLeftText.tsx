import { View, Text, Image } from "react-native";
import React from "react";
import DefaultText from "../../atoms/DefaultText";
import { WeatherData, weatherKey } from "@/constants/constants";
import { weatherPNG } from "@/utils/exampleForecast";
import { colors } from "@/assets/colors/colors";
import { getUVRating } from "../../uv-index/utils/getUVRating";

interface GraphLeftTextProps {
  data: WeatherData;
  item: { id: number };
}

const GraphLeftText = ({ data, item }: GraphLeftTextProps) => {
  const hourlyUVArr = data.forecast?.forecastday[item.id]?.hour.map((hour) =>
    Math.round(hour.uv)
  );

  const currentUV = Math.round(data.current?.uv);
  const dailyMaxUV = Math.max(...hourlyUVArr);

  return (
    <View className="flex-row justify-between items-center">
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <DefaultText className="text-4xl">
            {item.id === 0 ? currentUV : dailyMaxUV}
          </DefaultText>

          <DefaultText className="text-2xl font-semibold">
            {item.id === 0 ? getUVRating(currentUV) : getUVRating(dailyMaxUV)}
          </DefaultText>
        </View>

        <DefaultText style={{ color: colors.lightGray }}>WHO UVI</DefaultText>
      </View>
    </View>
  );
};

export default GraphLeftText;
