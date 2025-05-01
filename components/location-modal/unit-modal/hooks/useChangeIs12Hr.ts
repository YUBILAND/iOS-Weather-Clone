import { setIs12Hr } from "@/state/settings/settingsSlice";
import { AppDispatch } from "@/state/store";
import { storeIs12Hr } from "@/utils/asyncStorage";
import { useDispatch } from "react-redux";

export const useChangeIs12Hr = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (value: boolean) => {
    dispatch(setIs12Hr(value));
    storeIs12Hr(value);
  };
};
