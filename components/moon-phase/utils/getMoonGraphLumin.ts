import { WeatherData } from "@/constants/constants";

export const getMoonGraphLumin = (data: WeatherData, x: number) => {
  const currentMoonIllumination =
    data.forecast?.forecastday[0].astro.moon_illumination;
  const startingMoonIllumination =
    (parseInt(currentMoonIllumination) / 100) * 15;

  const amplitude = 50;
  const xOffset = 3;
  const period = 4.6;
  const cutoff = 15;

  // Parabolic formula to calculate y

  // JS modulo can't handle negative, -1 % 15 should be 14 but gives -1
  const handleNegativeModulo =
    (((x + startingMoonIllumination) % cutoff) + cutoff) % cutoff;
  let y =
    amplitude * Math.cos(handleNegativeModulo / period + xOffset) + amplitude;

  // Apply bounds to ensure y stays between 0 and 100
  if (y > 100) y = 100;
  if (y < 0) y = 0;

  return y;
};
