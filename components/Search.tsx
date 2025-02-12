import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { RefObject, useRef } from "react";
import { colors } from "@/assets/colors/colors";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { Location } from "@/app";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface SearchProps {
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  toggleSearch: (textInputRef: RefObject<TextInput>) => void;
  locations: Location[];
  handleLocation: (location: Location) => void;
}

const Search: React.FC<SearchProps> = ({
  handleTextDebounce,
  showSearch,
  toggleSearch,
  locations,
  handleLocation,
}) => {
  const textInputRef = useRef<TextInput>(null);

  return (
    <>
      <View
        className="flex-row justify-end items-center rounded-full"
        style={{
          backgroundColor: showSearch ? colors.bgWhite(0.2) : "transparent",
        }}
      >
        <TextInput
          ref={textInputRef}
          onChangeText={handleTextDebounce}
          placeholder="Search city"
          placeholderTextColor={"lightgray"}
          className="pl-6 h-10 pb-1 flex-1 text-base text-white"
          style={[
            {
              opacity: showSearch ? 1 : 0,
              pointerEvents: showSearch ? undefined : "none",
            },
          ]}
        />

        <TouchableOpacity
          onPress={() => toggleSearch(textInputRef)}
          className="rounded-full p-3 m-1"
        >
          <MagnifyingGlassIcon size={25} color={"white"} />
        </TouchableOpacity>
      </View>
      {locations.length > 0 && showSearch ? (
        <View className="absolute w-full bg-gray-300 top-16 mt-2 rounded-3xl">
          {locations.map((location, index) => {
            let showBorder = index + 1 !== locations.length;
            let borderClass = showBorder
              ? "border-b-2 border-b-gray-400"
              : "mb-0";
            return (
              <TouchableOpacity
                onPress={() => handleLocation(location as Location)}
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
    </>
  );
};

export default Search;
