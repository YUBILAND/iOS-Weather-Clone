import { useOtherUnits } from "./useOtherUnits";
import { useTemperatureUnit } from "./useTemperatureUnit";
import {
  convertPressureUnits,
  convertWindUnits,
  cToF,
  inToMm,
  miToKm,
} from "@/constants/conversion";

export const getTemperature = (celsius: number) => {
  const tempUnit = useTemperatureUnit();
  return tempUnit === "celsius" ? celsius : cToF(celsius);
};

export const getWind = (mph: number) => {
  const windUnit = useOtherUnits()["wind"];
  return convertWindUnits(mph, windUnit);
};

export const getPrecipitation = (inch: number) => {
  const precipUnit = useOtherUnits()["precipitation"];
  return precipUnit === "in" ? inch : inToMm(inch);
};

export const getPressure = (inHg: number) => {
  const pressureUnit = useOtherUnits()["pressure"];
  return convertPressureUnits(inHg, pressureUnit);
};

export const getDistance = (miles: number) => {
  const distanceUnit = useOtherUnits()["distance"];
  return distanceUnit === "mi" ? miles : miToKm(miles);
};
