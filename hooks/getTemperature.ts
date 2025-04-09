import { TempUnit } from "@/components/location-modal/SettingsDropdown";
import { cToF } from "./CtoF";
import { useTemperatureUnit } from "./useTemperatureUnit";

// export const getTemperature = (celsius: number) => {
//   const tempUnit = useTemperatureUnit();
//   return tempUnit === "celsius" ? celsius : cToF(celsius);
// };

export const getTemperature = (celsius: number, tempUnit: TempUnit) => {
  return tempUnit === "celsius" ? celsius : cToF(celsius);
};
