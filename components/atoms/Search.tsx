import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  TouchableHighlight,
} from "react-native";
import React, { RefObject, useRef } from "react";
import { colors } from "@/assets/colors/colors";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { Location } from "@/constants/constants";
import DefaultText from "./DefaultText";

interface SearchProps {
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  handleToggleSearch: () => void;
  searchResultLocations: Location[];
  handleLocation: (location: Location) => void;
  textInputRef: RefObject<TextInput>;
  handleCancel: () => void;
}

const Search: React.FC<SearchProps> = ({
  handleTextDebounce,
  showSearch,
  handleToggleSearch,
  searchResultLocations,
  handleLocation,
  textInputRef,
  handleCancel,
}) => {
  console.log("RERENDERED SEARCH WHY");
  return (
    <View className="flex-row items-center gap-x-2">
      <TouchableHighlight
        className=" relative flex-row justify-end items-center rounded-xl flex-1"
        style={{
          backgroundColor: colors.bgWhite(0.2),
          // width: 100,
          // backgroundColor: colors.bgMediumGray(0.2),
        }}
        onPress={handleToggleSearch}
        underlayColor="rgba(215, 215, 215, 0.77)"
      >
        <>
          <TouchableOpacity
            // onPress={() => toggleSearch(textInputRef)}
            className="px-2 px-1 m-1"
          >
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
                // opacity: showSearch ? 1 : 0,
                pointerEvents: showSearch ? undefined : "none",
              },
            ]}
          />
        </>
      </TouchableHighlight>
      {searchResultLocations.length > 0 && showSearch ? (
        <View className="absolute w-full bg-gray-300 top-16 mt-2 rounded-3xl">
          {searchResultLocations.map((location, index) => {
            let showBorder = index + 1 !== searchResultLocations.length;
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
