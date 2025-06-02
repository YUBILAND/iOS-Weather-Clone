import { colors } from "@/assets/colors/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable } from "react-native";
import HorizontalLine from "../atoms/HorizontalLine";

const ArrowAndList = ({
  pressArrow,
  pressList,
}: {
  pressArrow: () => void;
  pressList: () => void;
}) => (
  <View
    style={{
      alignSelf: "flex-end",
      backgroundColor: colors.mediumGray,
      borderRadius: 10,
      paddingVertical: 12,
      // paddingHorizontal: 16,
      gap: 8,
    }}
  >
    <Pressable onPress={pressArrow} className="px-4">
      <FontAwesome6 name="location-arrow" size={20} color={"white"} />
    </Pressable>

    <View>
      <HorizontalLine />
    </View>
    <Pressable onPress={pressList} className="px-4">
      <FontAwesome6 name="list-ul" size={20} color={"white"} />
    </Pressable>
  </View>
);

export default ArrowAndList;
