import { RootState } from "@/state/store";
import React, { MutableRefObject } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { useSelector } from "react-redux";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import DailyForecastItem from "./DailyForecastItem";
import CardTitle from "../atoms/CardTitle";
import { useWeatherData } from "@/hooks/useWeatherData";

interface DailyForecastCardProps {
  cityName: string;
  showModal: () => void;
  setCurrentIndex: (index: number) => void;
  openModalOnIndexRef: MutableRefObject<boolean>;
  iconSize: number;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({
  cityName,
  showModal,
  setCurrentIndex,
  openModalOnIndexRef,
  iconSize,
}) => {
  const data = useWeatherData();
  const { forecast, current } = data[cityName];

  return (
    <OpacityCard className="px-4 gap-y-2">
      <Pressable>
        <CardTitle
          title={"10-Day Forecast"}
          icon={<CalendarDaysIcon size={iconSize} color={"white"} />}
          className={"pb-2"}
        />

        <ScrollView
          contentContainerStyle={{
            marginHorizontal: 0,
          }}
          showsHorizontalScrollIndicator={false}
        >
          <View className="gap-y-3">
            {forecast?.forecastday.map((item, index) => (
              <DailyForecastItem
                key={index}
                data={data[cityName]}
                item={item}
                index={index}
                showModal={showModal}
                setCurrentIndex={setCurrentIndex}
                openModalOnIndexRef={openModalOnIndexRef}
              />
            ))}
          </View>
        </ScrollView>
      </Pressable>
    </OpacityCard>
  );
};

export default React.memo(DailyForecastCard);
