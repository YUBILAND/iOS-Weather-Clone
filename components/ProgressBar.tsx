import { View, Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

type ProgressBarProps = {
  high: number;
  low: number;
};

const ProgressBar = ({ high, low }: ProgressBarProps) => {
  return (
    <LinearGradient
      colors={["#68CAD4", "#AED06A", "#DACE2C", "#FFC907", "#F8981D"]} // Define your gradient colors
      start={{ x: 0, y: 0 }} // Start point (left)
      end={{ x: 1, y: 0 }} // End point (right)
      style={{ width: 90, height: 6, borderRadius: 20 }} // Set the size
    />
  );
};

export default ProgressBar;
