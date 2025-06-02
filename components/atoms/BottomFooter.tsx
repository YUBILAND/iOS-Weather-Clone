import { colors } from "@/assets/colors/colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Pressable, View } from "react-native";
import { ExpandingDot } from "react-native-animated-pagination-dots";

interface BottomFooterProps {
  weatherScreens: string[];
  setShowLocationModal: (visible: boolean) => void;
  setShowMapModal: (visible: boolean) => void;
  scrollX: Animated.Value;
}

const BottomFooter = ({
  weatherScreens,
  setShowLocationModal,
  setShowMapModal,
  scrollX,
}: BottomFooterProps) => {
  const expandingDotProps = {
    expandingDotWidth: 10,
    scrollX: scrollX,
    inActiveDotOpacity: 0.6,
    activeDotColor: colors.bgWhite(0.8),
    inActiveDotColor: colors.bgWhite(0.5),

    dotStyle: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
    },
    containerStyle: {
      position: "relative" as const,
      top: 0,
    },
  };
  const dataDotProp: Array<{ id: string }> = weatherScreens.map(
    (city, index) => ({
      id: city,
      cityName: city,
    })
  );
  return (
    <View className="mx-4 mt-3 flex-row justify-between">
      <Pressable onPress={() => setShowMapModal(true)}>
        <Ionicons name="map-outline" size={25} color={"white"} />
      </Pressable>

      <ExpandingDot {...expandingDotProps} data={dataDotProp} />
      <Pressable onPress={() => setShowLocationModal(true)}>
        <FontAwesome6 name="list-ul" size={20} color={"white"} />
      </Pressable>
    </View>
  );
};

export default BottomFooter;
