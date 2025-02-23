import { View, Text } from "react-native";
import React from "react";
import { Location } from "@/app";
import DefaultText from "./DefaultText";

const LocationName = ({
  location,
  className,
}: {
  location?: Location;
  className: string;
}) => {
  return <DefaultText className={className}>{location?.name}</DefaultText>;
};

export default LocationName;
