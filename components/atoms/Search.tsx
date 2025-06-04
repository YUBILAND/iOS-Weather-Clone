import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  TouchableHighlight,
  FlatList,
} from "react-native";
import React, { RefObject, useCallback, useRef, useState } from "react";
import { colors } from "@/assets/colors/colors";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { Location } from "@/constants/constants";
import DefaultText from "./DefaultText";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { fetchWeatherDataArr } from "@/state/api/apiSlice";
import { fetchLocations } from "@/api/weather";
import { debounce } from "lodash";
import RedBox from "./RedBox";

interface SearchProps {
  handleSelectLocation: () => void;
  textInputRef: RefObject<TextInput>;
  weatherScreenFlatListRef: RefObject<FlatList>;
}

const Search: React.FC<SearchProps> = ({
  handleSelectLocation,
  textInputRef,
  weatherScreenFlatListRef,
}) => {
  console.log("RERENDERED SEARCH WHY");

  const dispatch = useDispatch<AppDispatch>();

  const [showSearch, setShowSearch] = useState(false);
  const [searchResultLocations, setSearchResultLocations] = useState<
    Location[]
  >([]);

  const handleAddCity = async (location: Location) => {
    try {
      await dispatch(fetchWeatherDataArr({ cityName: location.name }));
      setShowSearch(false);
      setSearchResultLocations([]);

      handleSelectLocation();
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
        console.log(data);
      });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  // const handleToggleSearch = (textInputRef: RefObject<TextInput>) => {
  //     setShowSearch((prevState) => !prevState);
  //     !showSearch ? textInputRef.current?.focus() : textInputRef.current?.blur();
  //   };

  const handleToggleSearch = useCallback(() => {
    setShowSearch((prevState) => !prevState);
    !showSearch ? textInputRef.current?.focus() : textInputRef.current?.blur();
    const flatlistExists = weatherScreenFlatListRef.current !== null;
    if (flatlistExists) {
      weatherScreenFlatListRef.current.scrollToOffset({
        animated: false,
        offset: 0,
      });
    }
  }, [textInputRef]);

  const handleCancel = () => {
    handleToggleSearch();
  };

  return (
    <View className="flex-row items-center gap-x-2">
      <TouchableHighlight
        className=" relative flex-row justify-end items-center rounded-xl flex-1"
        style={{
          backgroundColor: colors.bgWhite(0.2),
        }}
        onPress={handleToggleSearch}
        underlayColor="rgba(215, 215, 215, 0.77)"
      >
        <>
          <TouchableOpacity className="px-2 px-1 m-1">
            <MagnifyingGlassIcon size={20} color={"white"} />
          </TouchableOpacity>

          <TextInput
            ref={textInputRef}
            onChangeText={handleTextDebounce}
            placeholder="Search city or airport"
            placeholderTextColor={"lightgray"}
            className="h-10 pb-1 flex-1 text-base text-white"
            style={[
              {
                pointerEvents: showSearch ? undefined : "none",
              },
            ]}
          />
        </>
      </TouchableHighlight>
      {searchResultLocations.length > 0 && showSearch ? (
        <View
          className="absolute w-full bg-gray-300 rounded-3xl"
          style={{ top: 50 }}
        >
          {searchResultLocations.map((location, index) => {
            let showBorder = index + 1 !== searchResultLocations.length;
            let borderClass = showBorder
              ? "border-b-2 border-b-gray-400"
              : "mb-0";
            return (
              <TouchableOpacity
                onPress={() => handleAddCity(location as Location)}
                key={location.id}
                className={`flex-row items-center border-0 p-3 px-4 mb-1 ${borderClass}`}
              >
                <MapPinIcon size={20} color="gray" />
                <Text className="text-black text-lg ml-2">
                  {location?.name}, {location?.country}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {/* Cancel Component */}
      <TouchableOpacity
        onPress={handleCancel}
        style={{ display: showSearch ? "flex" : "none" }}
      >
        <DefaultText style={{ fontSize: 16 }}>Cancel</DefaultText>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(Search);
