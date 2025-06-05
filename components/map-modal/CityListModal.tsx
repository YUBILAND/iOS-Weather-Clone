import React from "react";
import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import ModalContainer from "../modal/ModalContainer";
import { colors } from "@/assets/colors/colors";
import { useWeatherData } from "@/hooks/useWeatherData";
import DefaultText from "../atoms/DefaultText";
import { getWeatherName, weatherNameToImage } from "@/utils/exampleForecast";
import HorizontalLine from "../atoms/HorizontalLine";

interface CityListModalProps {
  showCities: boolean;
  setShowCities: (visible: boolean) => void;
  weatherScreens: string[];
  pressCity: (index: number) => void;
}
const CityListModal = ({
  showCities,
  setShowCities,
  weatherScreens,
  pressCity,
}: CityListModalProps) => {
  const data = useWeatherData();
  return (
    <ModalContainer
      modalVisible={showCities}
      setModalVisible={setShowCities}
      topPercentage={"60%"}
      backgroundColor={"#D3D3D3"}
      outerColor={colors.lightGray}
      innerColor={colors.mediumGray}
      title="Current Conditions"
      textColor={"black"}
    >
      <View
        className=" mx-8 py-4"
        style={{ borderRadius: 20, backgroundColor: "white" }}
      >
        {weatherScreens.map((city, index) => {
          const lastIndex = index === weatherScreens.length - 1;

          const { current: cityCurrent } = data[city];

          const weatherCode = cityCurrent.condition.code;
          const isDay = cityCurrent.is_day;
          //   console.log(city, "is day?", isDay);
          const imageSize = 40;
          return (
            <TouchableOpacity key={city}>
              <TouchableOpacity
                onPress={() => pressCity(index)}
                className="flex-row items-center justify-between px-8 py-2"
              >
                <DefaultText style={{ color: "black", fontSize: 20 }}>
                  {city}
                </DefaultText>

                <Image
                  source={weatherNameToImage(
                    getWeatherName(weatherCode),
                    isDay
                  )}
                  style={{ width: imageSize, height: imageSize }}
                />
              </TouchableOpacity>

              {!lastIndex && (
                <View className="pl-8">
                  <HorizontalLine color="black" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ModalContainer>
  );
};

export default React.memo(CityListModal);
