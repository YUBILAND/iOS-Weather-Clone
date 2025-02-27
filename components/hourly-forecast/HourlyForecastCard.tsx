import { colors } from "@/assets/colors/colors";
import { weatherKey, WeatherType } from "@/constants/constants";
import { getHourlyForecastResult } from "@/hooks/hourlyForecastHook";
import { RootState } from "@/state/store";
import { weatherPNG } from "@/utils/exampleForecast";
import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { SelectModal } from "../WeatherAtLocation";
import DefaultText from "../atoms/DefaultText";
import OpacityCard from "../atoms/OpacityCard";
import RoundedTemperature from "../atoms/RoundedTemperature";
import ModalContainer from "../modal/ModalContainer";
import { modalDropdownObjects } from "../modal/utils/constants";
import HourlyModal from "../modal/Modal";
import HourlyForecastItem from "./HourlyForecastItem";
import { DailyStats } from "./utils/constants";

interface HourlyForecastProps {
  cityName: string;
  modalVisible: boolean;
  setModalVisible: (modal: SelectModal | null) => void;
  modalID: SelectModal;
}

const HourlyForecast = ({
  cityName,
  modalVisible,
  setModalVisible,
  modalID,
}: HourlyForecastProps) => {
  const { americanTime } = useSelector((state: RootState) => state.settings);
  const { data } = useSelector((state: RootState) => state.weather);
  const { location, forecast } = data[cityName];

  const [dailyArr, setDailyArr] = useState<DailyStats[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentIndexRef = useRef<number>(0);
  const [selectedModal, setSelectedModal] = useState<number>(0);

  useEffect(() => {
    if (location)
      setDailyArr(getHourlyForecastResult(data[cityName], americanTime));
  }, []);

  const weatherMessage = "Random text related to today's weather";

  return (
    <OpacityCard>
      <Pressable className="gap-y-3 " onPress={() => setModalVisible(modalID)}>
        <ModalContainer
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          cityName={cityName}
          title={modalDropdownObjects[selectedModal].name}
          iconName="cloud"
        >
          <HourlyModal
            cityName={cityName}
            currentIndex={currentIndex}
            setCurrentIndex={(index: number) => setCurrentIndex(index)}
            currentIndexRef={currentIndexRef}
            selectedModal={selectedModal}
            setSelectedModal={(index: number) => setSelectedModal(index)}
          />
        </ModalContainer>

        <View className="flex-row ml-2 px-4">
          <DefaultText>{weatherMessage}</DefaultText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            borderTopWidth: 1,
            borderTopColor: colors.bgWhite(0.2),
            paddingRight: 16,
            marginHorizontal: 16,
            // no gap, use padding left and right so whitespace is scrollable
          }}
        >
          {dailyArr.map((hour, index) => (
            <HourlyForecastItem
              key={hour?.fullDate}
              modalID={modalID}
              hour={hour}
              index={index}
              dailyArr={dailyArr}
              setModalVisible={setModalVisible}
            />
          ))}
        </ScrollView>
      </Pressable>
    </OpacityCard>
  );
};

export default HourlyForecast;
