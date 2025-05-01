import { setTempUnit } from "@/state/settings/settingsSlice";
import { AppDispatch } from "@/state/store";
import { storeTempUnit } from "@/utils/asyncStorage";
import { useDispatch } from "react-redux";
import { TempUnit } from "../../SettingsDropdown";

export const useChangeTempUnit = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Update redux state
  return (tempUnit: TempUnit) => {
    dispatch(setTempUnit(tempUnit));
    // Update asyncStorage
    storeTempUnit(tempUnit);
  };
};
