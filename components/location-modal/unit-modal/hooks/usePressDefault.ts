import { useDispatch } from "react-redux";
import { TempUnit } from "../../SettingsDropdown";
import { AppDispatch } from "@/state/store";
import {
  setIs12Hr,
  setOtherUnits,
  setTempUnit,
} from "@/state/settings/settingsSlice";
import {
  storeIs12Hr,
  storeOtherUnits,
  storeTempUnit,
} from "@/utils/asyncStorage";
import { defaultOtherUnits } from "@/state/settings/constants";

export const usePressDefault = () => {
  const dispatch = useDispatch<AppDispatch>();

  const defaultTempUnit: TempUnit = "fahrenheit";
  const defaultIs12Hr: boolean = true;

  return () => {
    dispatch(setTempUnit(defaultTempUnit));
    storeTempUnit(defaultTempUnit);

    dispatch(setIs12Hr(defaultIs12Hr));
    storeIs12Hr(defaultIs12Hr);

    dispatch(setOtherUnits(defaultOtherUnits));
    storeOtherUnits(defaultOtherUnits);
  };
};
