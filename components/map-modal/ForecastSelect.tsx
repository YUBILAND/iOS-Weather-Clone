import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ForecastSelect = () => (
  <View className="flex-row items-center ">
    <Text style={{ fontWeight: 700, fontSize: 16, lineHeight: 16 }}>
      2-Hour Forecast
    </Text>
    <Ionicons name="chevron-expand" size={24} />
  </View>
);

export default ForecastSelect;
