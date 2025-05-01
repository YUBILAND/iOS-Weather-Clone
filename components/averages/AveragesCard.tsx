import { RootState } from "@/state/store";
import React from "react";
import { Pressable, View } from "react-native";
import { EyeIcon } from "react-native-heroicons/outline";
import { useSelector } from "react-redux";
import CardBottomText from "../atoms/CardBottomText";
import CardStat from "../atoms/CardStat";
import CardTitle from "../atoms/CardTitle";
import OpacityCard from "../atoms/OpacityCard";
import DefaultText from "../atoms/DefaultText";
import { colors } from "@/assets/colors/colors";
import { Octicons } from "@expo/vector-icons";
import { getAverageData } from "./AveragesModal";
import { getTemperature } from "@/hooks/useDisplayUnits";

interface AveragesCardProps {
  cityName: string;
  showModal: () => void;
  iconSize: number;
}

const AveragesCard = ({ cityName, showModal, iconSize }: AveragesCardProps) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const degSymbol = "°";

  const { currentTemperature, averageHigh, tempFromAverage } = getAverageData(
    data[cityName]
  );

  const tempSign = currentTemperature >= averageHigh ? "+" : "-";
  const currentHigh = getTemperature(
    data[cityName].forecast.forecastday[0].day.maxtemp_c
  );

  const fromAverageText =
    (tempSign === "+" ? " above " : " from ") + "average daily high";

  return (
    <OpacityCard>
      <Pressable
        className="px-4 gap-y-2 h-full"
        onPress={() => {
          showModal();
        }}
      >
        <CardTitle
          title={"Averages"}
          icon={<Octicons name="graph" size={iconSize} color={"white"} />}
        />

        <CardStat stat={tempSign + tempFromAverage + "°"} />

        <CardBottomText text={fromAverageText} />

        <View className="gap-1">
          <View className="flex-row justify-between items-center">
            <DefaultText style={{ color: colors.lightGray }}>Today</DefaultText>
            <DefaultText style={{ fontWeight: 800 }}>
              H:{Math.round(currentHigh)}°
            </DefaultText>
          </View>
          <View className="flex-row justify-between items-center">
            <DefaultText style={{ color: colors.lightGray }}>
              Average
            </DefaultText>
            <DefaultText style={{ fontWeight: 800 }}>
              H:{averageHigh}°
            </DefaultText>
          </View>
        </View>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(AveragesCard);
