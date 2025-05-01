import { PressureUnit, WindUnit } from "@/state/settings/constants";

// For Temperature
export const cToF = (celsius: number) => {
  return celsius * (9 / 5) + 32;
};

// For Wind
export const convertWindUnits = (mph: number, windUnit: WindUnit) => {
  "worklet";

  const mphToKmh = (mph: number) => {
    return mph * 1.60934;
  };
  const mphToMss = (mph: number) => {
    return mph * 0.44704;
  };
  const mphToBft = (mph: number) => {
    // approximation
    return (mph + 6) / 6;
  };
  const mphToKnots = (mph: number) => {
    return mph * 0.868976;
  };

  return windUnit === "kmh"
    ? mphToKmh(mph)
    : windUnit === "mss"
    ? mphToMss(mph)
    : windUnit === "bft"
    ? mphToBft(mph)
    : windUnit === "kn"
    ? mphToKnots(mph)
    : mph;
};

// For Precipitiation
export const inToMm = (inch: number) => {
  return inch * 25.4;
};

// For Pressure
export const convertPressureUnits = (inHg: number, unit: PressureUnit) => {
  // mbar and hpa are the same unit of measurement 1 hPa = 1 mbar
  return ["mbar", "hPa"].includes(unit)
    ? inHg * 33.8639
    : unit === "mmHg"
    ? inHg * 25.4
    : unit === "kPa"
    ? inHg * 3.38639
    : inHg;
};

// For Distance
export const miToKm = (miles: number) => {
  return miles * 1.60934;
};
