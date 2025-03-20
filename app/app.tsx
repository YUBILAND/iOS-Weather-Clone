import { StatusBar } from "expo-status-bar";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
  View,
  ViewToken,
} from "react-native";

import { fetchLocations } from "@/api/weather";
import Spinner from "@/components/atoms/Spinner";
import { getData } from "@/utils/asyncStorage";
import { debounce } from "lodash";
import "../global.css";

import WeatherAtLocation, {
  WeatherAtLocationProps,
} from "@/components/WeatherAtLocation";
import { useWindowDimensions } from "react-native";

import BottomFooter from "@/components/atoms/BottomFooter";
import LocationModal from "@/components/LocationModal/LocationModal";
import { Location } from "@/constants/constants";
import { fetchWeatherData } from "@/state/api/apiSlice";
import { AppDispatch, RootState } from "@/state/store";
import { getWeatherName, weatherNameToCardBg } from "@/utils/exampleForecast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

import { CrossfadeImage } from "react-native-crossfade-image";

const App = () => {
  const resetWeatherScreens = false;
  if (resetWeatherScreens) {
    AsyncStorage.clear();
  }
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const [showSearch, setShowSearch] = useState(false);
  const [searchResultLocations, setSearchResultLocations] = useState<
    Location[]
  >([]);
  const [weatherScreens, setWeatherScreens] = useState<string[]>([]);
  const [update, setUpdate] = useState(false);

  const FirstCity = async () => {
    const cityArray = await getData("city");
    // console.log(cityArray);
    setWeatherScreens(cityArray);
  };

  // Fetch the weather data when the component mounts
  // useEffect(() => {
  //   dispatch(fetchWeatherData());
  //   FirstCity();
  // }, [update]);
  useEffect(() => {
    dispatch(fetchWeatherData());
    FirstCity();
  }, [update]);

  // Add New Weather Location
  const handleLocation = async (location: Location) => {
    try {
      setShowSearch(false);
      setSearchResultLocations([]);
      setUpdate(!update);
      setShowLocationModal(false);
      await dispatch(fetchWeatherData(location.name));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSearch = (value: string): void => {
    // fetch location based on autocomplete of user input
    let autoCompleteMinimumLength = 2;
    if (value.length > autoCompleteMinimumLength) {
      fetchLocations(value).then((data) => {
        setSearchResultLocations(data);
        // console.log(data);
      });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const toggleSearch = (textInputRef: RefObject<TextInput>) => {
    setShowSearch((prevState) => !prevState);
    !showSearch ? textInputRef.current?.focus() : textInputRef.current?.blur();
  };

  const { width } = useWindowDimensions();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  // if (!cityData) {
  //   return (
  //     <View className="flex-1 relative">
  //       <StatusBar style="light" />
  //       <Image
  //         blurRadius={70}
  //         className="absolute h-full w-full"
  //         source={require("../assets/images/bg.png")}
  //       />

  //       <Text>No weather api data available</Text>
  //     </View>
  //   );
  // }

  const [showLocationModal, setShowLocationModal] = useState(false);

  const flatlistRef = useRef<FlatList>(null);

  const handleShowWeatherScreen = (index: number) => {
    flatlistRef.current?.scrollToIndex({ index: index });
    setShowLocationModal(false);
  };

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

  const currentCityName = weatherScreens[currentCardIndex];

  const background = weatherNameToCardBg(
    getWeatherName(data[currentCityName]?.current.condition.code),
    data[currentCityName]?.current.is_day
  );

  const props = {
    handleTextDebounce,
    showSearch,
    toggleSearch,
    searchResultLocations,
    handleLocation,
    currentCardIndex,
  };

  const dataProp: Array<{ id: string } & WeatherAtLocationProps> = useMemo(
    () =>
      weatherScreens.map((city, index) => ({
        id: city,
        ...props,
        cityName: city,
      })),
    [weatherScreens]
  );

  const flatlistProps = {
    horizontal: true,
    decelerationRate: 0,
    snapToInterval: width, // Use the screen width
    snapToAlignment: "center" as const,
    showsHorizontalScrollIndicator: false,
    pagingEnabled: true,
    onScroll: Animated.event(
      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
      { useNativeDriver: false }
    ),
  };

  const handleViewableItemsChanged = useCallback(
    ({
      viewableItems,
      changed,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      const currentIndex = viewableItems[0].index;
      // console.log(currentIndex);
      if (currentIndex != null) {
        setCurrentCardIndex(currentIndex);
      }
    },
    [weatherScreens]
  );

  const handleRenderItem = useCallback(
    ({ item }: { item: { id: string } & WeatherAtLocationProps }) => {
      const { id, ...restProps } = item;
      return <WeatherAtLocation {...restProps} />;
    },
    []
  );

  if (loading) {
    return (
      <View className="flex-1 relative">
        <StatusBar style="light" />
        <Image
          blurRadius={70}
          className="absolute h-full w-full"
          source={require("../assets/images/bg.png")}
        />
        <Spinner />
      </View>
    );
  }

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />

      <CrossfadeImage
        style={{ width: "100%", height: "100%", position: "absolute" }}
        source={background}
        resizeMode="cover"
      />

      <SafeAreaView className="flex flex-1 ">
        <View className="relative pb-10 h-full">
          {/* Bottom Footer */}
          <View className="w-full h-10 absolute bottom-0 right-0 ">
            <BottomFooter
              scrollX={scrollX}
              weatherScreens={weatherScreens}
              setShowLocationModal={(visible: boolean) =>
                setShowLocationModal(visible)
              }
            />
          </View>

          <LocationModal
            showLocationModal={showLocationModal}
            handleTextDebounce={handleTextDebounce}
            showSearch={showSearch}
            toggleSearch={toggleSearch}
            searchResultLocations={searchResultLocations}
            handleLocation={handleLocation}
            weatherScreens={weatherScreens}
            goToWeatherScreen={(index: number) =>
              handleShowWeatherScreen(index)
            }
          />

          {/* Weather at location */}
          <FlatList
            onViewableItemsChanged={handleViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            ref={flatlistRef}
            data={dataProp}
            keyExtractor={(item: { id: string }) => item.id}
            renderItem={handleRenderItem}
            {...flatlistProps}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};
export default App;
