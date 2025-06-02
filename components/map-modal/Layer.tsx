import { colors } from "@/assets/colors/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View, Text, Pressable } from "react-native";

interface LayerProps {
  pressLayer: () => void;
}
const Layer = ({ pressLayer }: LayerProps) => (
  <Pressable
    style={{
      alignSelf: "flex-end",
      backgroundColor: colors.mediumGray,
      borderRadius: 10,
      paddingVertical: 12,
      // paddingHorizontal: 16,
    }}
    onPress={pressLayer}
  >
    <View className="px-4">
      <FontAwesome6 name="layer-group" size={20} color={"white"} />
    </View>
  </Pressable>
);

export default React.memo(Layer);
