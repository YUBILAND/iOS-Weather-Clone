import { Entypo, Ionicons, Octicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { OpaqueColorValue } from "react-native";
import { VscBellDot } from "react-icons/vsc";
import { RiCelsiusFill } from "react-icons/ri";
import { TbTemperatureFahrenheit } from "react-icons/tb";
import { HiChartBar } from "react-icons/hi";
import { TbMessageReport } from "react-icons/tb";

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

export const AveragesIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <Octicons name="graph" size={size} color={color} />;
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

export const PencilIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string | OpaqueColorValue;
}) => {
  return <Ionicons name={"pencil"} size={size} color={color} />;
};

export const BellIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <MaterialCommunityIcons
      name="bell-badge-outline"
      size={size}
      color={color}
    />
  );
};

export const CelsiusIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <MaterialCommunityIcons
      name="temperature-celsius"
      size={size}
      color={color}
    />
  );
};

export const FahrenheitIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <MaterialCommunityIcons
      name="temperature-fahrenheit"
      size={size}
      color={color}
    />
  );
};

export const BarGraphIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string;
}) => {
  return <Entypo name="bar-graph" size={size} color={color} />;
};

export const PopUpIcon = ({
  size = 18,
  color = "white",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <MaterialCommunityIcons
      name="message-alert-outline"
      size={size}
      color={color}
    />
  );
};
