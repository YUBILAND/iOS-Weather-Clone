import { useCallback, useMemo } from "react";
import AirPressure from "../AirPressure";
import Averages from "../Averages";
import Daily from "../Daily";
import FeelsLike from "../FeelsLike";
import Hourly from "../Hourly";
import Humidity from "../Humidity";
import Moon from "../Moon";
import Precipitation from "../Precipitation";
import Quality from "../Quality";
import Sun from "../Sun";
import UV from "../UV";
import Visibility from "../Visibility";
import Wind from "../Wind";
import RainHour from "../RainHour";
import RainMap from "../RainMap";

export const buildCardArray = (isRainingNextHour: boolean) => {
  const normalCardOrder = [
    UV,
    Sun,
    FeelsLike,
    Precipitation,
    Visibility,
    Humidity,
    Averages,
    AirPressure,
  ];

  const shuffledCardOrder = [...normalCardOrder].sort(
    () => Math.random() - 0.5
  );

  // [
  //   ...(isRainingNextHour ? [RainHour] : []),
  //   Hourly,
  //   ...(isRainingNextHour ? [RainMap] : []),
  //   Daily,
  //   Quality,
  //   [UV, Sun],
  //   Wind,
  //   [FeelsLike, Precipitation],
  //   [Visibility, Humidity],
  //   Moon,
  //   [Averages, AirPressure],
  // ];

  return [
    ...(isRainingNextHour ? [RainHour] : []),
    Hourly,
    ...(isRainingNextHour ? [RainMap] : []),
    Daily,
    Quality,
    [shuffledCardOrder[0], shuffledCardOrder[1]],
    Wind,
    [shuffledCardOrder[2], shuffledCardOrder[3]],
    [shuffledCardOrder[4], shuffledCardOrder[5]],
    Moon,
    [shuffledCardOrder[6], shuffledCardOrder[7]],
  ];
};
