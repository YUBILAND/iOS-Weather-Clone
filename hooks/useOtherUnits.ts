import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

// export const useOtherUnits = () => {
//   const { otherUnits } = useSelector((state: RootState) => state.settings);
//   return otherUnits;
// };

export const useOtherUnits = () =>
  useSelector((state: RootState) => state.settings.otherUnits);
