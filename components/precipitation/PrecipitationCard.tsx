import { useWeatherData } from "@/hooks/useWeatherData";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import CardTitle from "../atoms/CardTitle";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";

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
  const data = useWeatherData();
  const { forecast } = data[cityName];

  const precipTemp =
    Math.round(forecast.forecastday[0].day.totalprecip_in).toString() + '"';

  const message = "in last 24h";
  const message2 = "Later there will be more rain or something";

  return (
    <OpacityCard>
      <Pressable
        className="px-4 gap-y-2 h-full"
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={"Precipitation"}
          icon={
            <FontAwesome6
              name="cloud-showers-heavy"
              size={iconSize}
              color={"white"}
            />
          }
        />

        <CardStat stat={precipTemp} />

        <CardBottomText text={message} />

        <DefaultText style={{ fontSize: 14, lineHeight: 14 }}>
          {message2}
        </DefaultText>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(PrecipitationCard);
