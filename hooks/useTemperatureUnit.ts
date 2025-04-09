import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

// export const useTemperatureUnit = () => {
//   const { tempUnit } = useSelector((state: RootState) => state.settings);
//   return tempUnit;
// };

export const useTemperatureUnit = () =>
  useSelector((state: RootState) => state.settings.tempUnit);
