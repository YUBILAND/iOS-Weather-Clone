import {
  View,
  Text,
  Modal,
  SafeAreaView,
  Dimensions,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import React, { RefObject } from "react";
import DefaultText from "../atoms/DefaultText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/assets/colors/colors";
import Search from "../atoms/Search";
import { Location } from "@/constants/constants";
import LocationCardContainer from "./LocationCardContainer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import LocationCardItem from "./LocationCardItem";
import LocationCardItemContainer from "./LocationCardItemContainer";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useAmericanTime } from "@/hooks/useAmericanTime";
import { removeZeroFromTimeString } from "@/hooks/hooks";
import { getDayArr } from "../precipitation/utils/getDayArr";

interface LocationModalProps {
  showLocationModal: boolean;
  goToWeatherScreen: (index: number) => void;
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  toggleSearch: (textInputRef: RefObject<TextInput>) => void;
  searchResultLocations: Location[];
  handleLocation: (location: Location) => void;
  weatherScreens: string[];
}
const LocationModal = ({
  showLocationModal,
  goToWeatherScreen,
  handleTextDebounce,
  showSearch,
  toggleSearch,
  searchResultLocations,
  handleLocation,
  weatherScreens,
}: LocationModalProps) => {
  const data = useWeatherData();
  const americanTime = useAmericanTime();

  const screenHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();

  // Calculate the height (subtract 47 pixels)
  const calculatedHeight = screenHeight - insets.top;
  console.log(weatherScreens);
  return (
    <Modal visible={showLocationModal} transparent animationType="slide">
      <SafeAreaView>
        <View
          style={{
            height: calculatedHeight,
            backgroundColor: colors.darkGray,
          }}
          className="px-4 pt-4"
        >
          {/* <Pressable onPress={closeModal} className="bg-red-400 h-20 w-20" /> */}
          <View className="w-full items-end">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="white"
            />
          </View>
          <View>
            <DefaultText className="text-4xl font-semibold">
              Weather
            </DefaultText>
          </View>
          <View className="pb-4 relative z-10">
            <Search
              handleTextDebounce={handleTextDebounce}
              showSearch={showSearch}
              toggleSearch={toggleSearch}
              searchResultLocations={searchResultLocations}
              handleLocation={handleLocation}
            />
          </View>

          <ScrollView className="relative z-0">
            <LocationCardContainer>
              {weatherScreens.map((city, idx) => {
                const currentTemp = parseFloat(data[city].current.temp_c);
                const currentTimeZone = data[city].location.tz_id;
                const cityTime = removeZeroFromTimeString(
                  new Date().toLocaleTimeString("en-US", {
                    timeZone: currentTimeZone,
                    hour12: americanTime,
                    hour: "numeric",
                    minute: "2-digit",
                  })
                );
                const currentWeatherCondition =
                  data[city].current.condition.text;
                const dailyTempArr = getDayArr(data[city], 0, "temp_c");
                const currentHigh = Math.max(...dailyTempArr);
                const currentLow = Math.min(...dailyTempArr);

                return (
                  <React.Fragment key={idx}>
                    <LocationCardItemContainer
                      weatherScreens={weatherScreens}
                      idx={idx}
                      goToWeatherScreen={goToWeatherScreen}
                    >
                      <LocationCardItem
                        currentCity={city}
                        currentTemp={Math.round(currentTemp)}
                        currentTime={cityTime}
                        currentWeatherCondition={currentWeatherCondition}
                        currentHigh={Math.round(currentHigh)}
                        currentLow={Math.round(currentLow)}
                      />
                    </LocationCardItemContainer>
                  </React.Fragment>
                );
              })}
            </LocationCardContainer>
          </ScrollView>
          {/* Locations picked */}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default LocationModal;
