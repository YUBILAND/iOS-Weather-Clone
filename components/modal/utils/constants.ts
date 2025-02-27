export type IoniconName =
  | "cloudy-night-outline"
  | "sunny-outline"
  | "water-outline"
  | "thermometer-outline"
  | "eye-outline"
  | "stopwatch-outline";

export interface modalDropdownObjectsType {
  label: string;
  id: number;
  imageName: IoniconName;
  name: string;
}

export const modalDropdownObjects: modalDropdownObjectsType[] = [
  {
    label: "Temperature",
    id: 0,
    imageName: "cloudy-night-outline",
    name: "Conditions",
  },
  { label: "UV Index", id: 1, imageName: "sunny-outline", name: "UV Index" },
  {
    label: "Wind",
    id: 2,
    imageName: "cloudy-night-outline",
    name: "Wind",
  },
  {
    label: "Precipitation",
    id: 3,
    imageName: "water-outline",
    name: "Precipitation",
  },
  {
    label: "Wind Chill",
    id: 4,
    imageName: "thermometer-outline",
    name: "Wind Chill",
  },
  { label: "Humidity", id: 5, imageName: "eye-outline", name: "Conditions" },
  {
    label: "Visibility",
    id: 6,
    imageName: "stopwatch-outline",
    name: "Humidity",
  },
  {
    label: "Air Pressure",
    id: 7,
    imageName: "cloudy-night-outline",
    name: "Air Pressure",
  },
];
