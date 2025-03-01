import { RootState } from "@/state/store";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { useSelector } from "react-redux";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import DailyForecastItem from "./DailyForecastItem";

interface DailyForecastCardProps {
  cityName: string;
  showModal: () => void;
  setCurrentIndex: (index: number) => void;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  cityName,
  showModal,
  setCurrentIndex,
}) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { forecast, current } = data[cityName];

  return (
    <OpacityCard>
      <Pressable>
        <View className="flex-row items-center mx-5 gap-x-2 opacity-40 mb-2">
          <CalendarDaysIcon size={22} color={"white"} />
          <DefaultText className="text-base uppercase font-semibold">
            10-Day Forecast
          </DefaultText>
        </View>

        <ScrollView
          contentContainerStyle={{
            marginHorizontal: 15,
          }}
          style={{}}
          showsHorizontalScrollIndicator={false}
        >
          {forecast?.forecastday.map((item, index) => (
            <DailyForecastItem
              key={index}
              data={data[cityName]}
              item={item}
              index={index}
              showModal={showModal}
              setCurrentIndex={setCurrentIndex}
            />
          ))}
        </ScrollView>
      </Pressable>
    </OpacityCard>
  );
};

export default DailyForecastCard;
