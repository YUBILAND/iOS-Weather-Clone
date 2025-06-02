import {
  AirPressureIcon,
  ConditionsIcon,
  HumidityIcon,
  PrecipitationIcon,
  UVIcon,
  VisibilityIcon,
  FeelsLikeIcon,
  WindIcon,
  PencilIcon,
  BellIcon,
  CelsiusIcon,
  FahrenheitIcon,
  BarGraphIcon,
  PopUpIcon,
  AveragesIcon,
} from "./icons";

// Types and constants for Modal Dropdown
export type SelectModal =
  | "conditions"
  | "airQuality"
  | "uv"
  | "wind"
  | "precipitation"
  | "feelsLike"
  | "humidity"
  | "visibility"
  | "averages"
  | "airPressure"
  | "sunPhase"
  | "moonPhase"
  | "rainHour";
export interface ModalDropdownObject {
  label: string;
  id: number;
}
export type ModalDropdownObjectsType = {
  [key in SelectModal]: ModalDropdownObject;
};
export const modalDropdownObjects: ModalDropdownObjectsType = {
  conditions: {
    label: "Conditions",
    id: 0,
  },
  airQuality: {
    label: "Air Quality",
    id: 1,
  },
  uv: {
    label: "UV Index",
    id: 2,
  },
  wind: {
    label: "Wind",
    id: 3,
  },
  precipitation: {
    label: "Precipitation",
    id: 4,
  },
  feelsLike: {
    label: "Feels Like",
    id: 5,
  },
  humidity: {
    label: "Humidity",
    id: 6,
  },
  visibility: {
    label: "Visibility",
    id: 7,
  },
  averages: {
    label: "Averages",
    id: 8,
  },
  airPressure: {
    label: "Air Pressure",
    id: 9,
  },
  sunPhase: {
    label: "Sun Phase",
    id: 10,
  },
  moonPhase: {
    label: "Moon Phase",
    id: 11,
  },
  rainHour: {
    label: "Next Hour Precipitation",
    id: 12,
  },
};

export interface IconProps {
  size?: number;
  color?: string;
}

export type IconObject = {
  [key in SelectModal]: React.ComponentType<IconProps> | null;
};

export const iconMap: IconObject = {
  conditions: ConditionsIcon,
  airQuality: ConditionsIcon,
  uv: UVIcon,
  wind: WindIcon,
  precipitation: PrecipitationIcon,
  feelsLike: FeelsLikeIcon,
  humidity: HumidityIcon,
  visibility: VisibilityIcon,
  averages: AveragesIcon,
  airPressure: AirPressureIcon,
  sunPhase: null,
  moonPhase: null,
  rainHour: null,
};

// Types and constants for Settings Dropdown
export type SelectSetting =
  | "editList"
  | "notifications"
  | "celsius"
  | "fahrenheit"
  | "units"
  | "reportAnIssue";
export type SettingsDropdownObjectsType = {
  [key in SelectSetting]: ModalDropdownObject;
};
export interface SettingsDropdownObject {
  label: string;
  id: number;
}
export const settingsDropdownObjects: SettingsDropdownObjectsType = {
  editList: {
    label: "Edit List",
    id: 0,
  },
  notifications: {
    label: "Notification",
    id: 1,
  },
  celsius: {
    label: "Celsius",
    id: 2,
  },
  fahrenheit: {
    label: "Fahrenheit",
    id: 3,
  },
  units: {
    label: "Units",
    id: 4,
  },
  reportAnIssue: {
    label: "Report an Issue",
    id: 5,
  },
};
export type SettingsIconObject = {
  [key in SelectSetting]: React.ComponentType<IconProps>;
};
export const settingsIconMap: SettingsIconObject = {
  editList: PencilIcon,
  notifications: BellIcon,
  celsius: CelsiusIcon,
  fahrenheit: FahrenheitIcon,
  units: BarGraphIcon,
  reportAnIssue: PopUpIcon,
};
