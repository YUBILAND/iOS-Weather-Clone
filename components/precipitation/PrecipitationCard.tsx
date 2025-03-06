import { RootState } from "@/state/store";
import React from "react";
import { Pressable, View } from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import ColoredBar from "../atoms/ColoredBar";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { colors } from "@/assets/colors/colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

interface PrecipitationCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}

const PrecipitationCard = ({
  cityName,
  showModal,
  iconSize,
}: PrecipitationCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { forecast, current } = data[cityName];

  const precipTemp =
    Math.round(forecast.forecastday[0].day.totalprecip_in).toString() + '"';

  const message = "Past 24 hours";
  const message2 = "Later there will be more rain or something";

  return (
    <OpacityCard>
      <Pressable
        className="px-4 gap-y-2 h-full"
        onPress={() => {
          showModal();
        }}
      >
        <View className="flex-row items-center  gap-x-2 opacity-40">
          <FontAwesome6
            name="cloud-showers-heavy"
            size={iconSize}
            color={"white"}
          />
          <DefaultText className="text-base uppercase font-semibold">
            Precipitation
          </DefaultText>
        </View>
        <DefaultText
          className="font-semibold"
          style={{ fontSize: 30, lineHeight: 30 }}
        >
          {precipTemp}
        </DefaultText>
        <DefaultText
          style={{ fontSize: 14, lineHeight: 14, color: colors.lightGray }}
        >
          {message}
        </DefaultText>

        <DefaultText style={{ fontSize: 14, lineHeight: 14 }}>
          {message2}
        </DefaultText>
      </Pressable>
    </OpacityCard>
  );
};

export default PrecipitationCard;
