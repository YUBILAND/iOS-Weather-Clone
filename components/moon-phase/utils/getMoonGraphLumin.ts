import { getDaysSincePrevFullMoon } from "./getDaysSincePrevFullMoon";

export const getMoonGraphLumin = (x: number) => {
  const amplitude = 50;
  // 4.9 because 15.7 / pi = 4.9
  const period = 4.9;
  const cutoff = 15;

  const daysSincePrevFullMoon = getDaysSincePrevFullMoon();

  // JS modulo can't handle negative, -1 % 15 should be 14 but gives -1
  const handleNegativeModulo =
    (((daysSincePrevFullMoon + x) % cutoff) + cutoff) % cutoff;

  let y = amplitude * Math.cos(handleNegativeModulo / period) + amplitude;

  // Apply bounds to ensure y stays between 0 and 100
  if (y > 100) y = 100;
  if (y < 0) y = 0;

  return y;
};
