import { RootState } from "@/state/store";
import React from "react";
import { View } from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import ColoredBar from "../atoms/ColoredBar";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import { getUVRating } from "./utils/getUVRating";
import { getUVMessage } from "./utils/getUVMessage";

const UVIndexCard = ({ cityName }: { cityName: string }) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { current } = data[cityName];

  const UV = Math.round(current?.uv);

  const rating = getUVRating(UV);
  const message = getUVMessage(UV);

  return (
    <OpacityCard className="px-4 gap-y-2 h-full">
      <View className="flex-row items-center  gap-x-2 opacity-40">
        <CalendarDaysIcon size={22} color={"white"} />
        <DefaultText className="text-base uppercase font-semibold">
          UV Index
        </DefaultText>
      </View>
      <DefaultText
        className="font-semibold"
        style={{ fontSize: 30, lineHeight: 30 }}
      >
        {UV}
      </DefaultText>
      <DefaultText
        className=" font-semibold"
        style={{ fontSize: 18, lineHeight: 18 }}
      >
        {rating}
      </DefaultText>

      <ColoredBar
        cityName={cityName}
        index={UV}
        maxIndex={12}
        label={"UV"}
        colorsArr={["#00df72", "#f5e536", "#fc9003", "#f51458", "#ad02f6"]}
        locationsArr={[0, 0.3, 0.6, 0.8, 1]}
      />

      <DefaultText>{message}</DefaultText>
    </OpacityCard>
  );
};

export default UVIndexCard;
