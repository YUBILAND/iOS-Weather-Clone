import { setOtherUnits } from "@/state/settings/settingsSlice";
import { AppDispatch } from "@/state/store";
import { storeOtherUnits } from "@/utils/asyncStorage";
import { useDispatch } from "react-redux";

export const useChangeOtherUnits = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Update redux state

  return (newOtherUnits: any) => {
    dispatch(setOtherUnits(newOtherUnits));
    storeOtherUnits(newOtherUnits);
  };
};
