import { WindUnit } from "@/state/settings/constants";

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
