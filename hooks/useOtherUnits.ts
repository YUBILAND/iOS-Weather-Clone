import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

export const useOtherUnits = () =>
  useSelector((state: RootState) => state.settings.otherUnits, shallowEqual);
