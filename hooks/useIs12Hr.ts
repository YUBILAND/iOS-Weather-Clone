import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

// export const useIs12Hr = () => {
//   const { is12Hr } = useSelector((state: RootState) => state.settings);
//   return is12Hr;
// };

export const useIs12Hr = () =>
  useSelector((state: RootState) => state.settings.is12Hr);
