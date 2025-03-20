import { View, Text, TextStyle } from "react-native";
import React from "react";
import DefaultText from "./DefaultText";
import { Location } from "@/constants/constants";

const LocationName = ({
  location,
  className,
  style,
}: {
  location?: Location;
  className: string;
  style?: TextStyle;
}) => {
  return (
    <DefaultText style={style} className={className}>
      {location?.name}
    </DefaultText>
  );
};

export default LocationName;
