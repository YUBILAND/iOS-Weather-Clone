export type SelectModal =
  | "temperature"
  | "uv"
  | "wind"
  | "precipitation"
  | "windChill"
  | "humidity"
  | "visibility"
  | "airPressure"
  | "sunPhase"
  | "moonPhase";

export type IoniconName =
  | "cloudy-night-outline"
  | "sunny-outline"
  | "water-outline"
  | "thermometer-outline"
  | "eye-outline"
  | "stopwatch-outline";

export interface ModalDropdownObject {
  label: string;
  id: number;
  imageName: IoniconName;
}

export type ModalDropdownObjectsType = {
  [key in SelectModal]: ModalDropdownObject;
};

export const modalDropdownObjects: ModalDropdownObjectsType = {
  temperature: {
    label: "Temperature",
    id: 0,
    imageName: "cloudy-night-outline",
  },
  uv: {
    label: "UV Index",
    id: 1,
    imageName: "sunny-outline",
  },
  wind: {
    label: "Wind",
    id: 2,
    imageName: "cloudy-night-outline",
  },
  precipitation: {
    label: "Precipitation",
    id: 3,
    imageName: "water-outline",
  },
  windChill: {
    label: "Wind Chill",
    id: 4,
    imageName: "thermometer-outline",
  },
  humidity: {
    label: "Humidity",
    id: 5,
    imageName: "eye-outline",
  },
  visibility: {
    label: "Visibility",
    id: 6,
    imageName: "stopwatch-outline",
  },
  airPressure: {
    label: "Air Pressure",
    id: 7,
    imageName: "cloudy-night-outline",
  },

  sunPhase: {
    label: "Sun Phase",
    id: 8,
    imageName: "cloudy-night-outline",
  },
  moonPhase: {
    label: "Moon Phase",
    id: 9,
    imageName: "cloudy-night-outline",
  },
};
