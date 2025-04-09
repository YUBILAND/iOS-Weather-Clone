export type WindUnit = "mph" | "kmh" | "mss" | "bft" | "kn";
export type PrecipUnit = "in" | "mm";
export type PressureUnit = "mbar" | "inHg" | "mmHg" | "hPa" | "kPa";
export type DistanceUnit = "mi" | "km";

export type OtherUnitsType = {
  wind: WindUnit;
  precipitation: PrecipUnit;
  pressure: PressureUnit;
  distance: DistanceUnit;
};

export const defaultOtherUnits: OtherUnitsType = {
  wind: "mph",
  precipitation: "in",
  pressure: "inHg",
  distance: "mi",
};
