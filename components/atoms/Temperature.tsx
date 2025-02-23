import { View, Text } from "react-native";
import React from "react";

const Temperature = ({
  celsius,
  className,
}: {
  celsius?: number;
  className: string;
}) => {
  return <Text className={className}>{celsius}&#176;</Text>;
};

export default Temperature;
