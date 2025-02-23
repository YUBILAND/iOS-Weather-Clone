import { View, Text } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";

const Spinner = () => {
  return (
    <View className="flex-1 flex-row justify-center items-center">
      <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
    </View>
  );
};

export default Spinner;
