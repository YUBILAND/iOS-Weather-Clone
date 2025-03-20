import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { OpaqueColorValue } from "react-native";

export const ConditionsIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <Ionicons name={"cloud-outline"} size={size} color={color} />;
};

export const UVIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <Feather name={"sun"} size={size} color={color} />;
};

export const WindIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <Feather name={"wind"} size={size} color={color} />;
};

export const PrecipitationIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return (
    <MaterialCommunityIcons name={"water-outline"} size={size} color={color} />
  );
};

export const FeelsLikeIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <FontAwesome name={"thermometer-half"} size={size} color={color} />;
};

export const HumidityIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <MaterialCommunityIcons name={"waves"} size={size} color={color} />;
};

export const VisibilityIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <Feather name={"eye"} size={size} color={color} />;
};

export const AirPressureIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <FontAwesome name={"tachometer"} size={size} color={color} />;
};
