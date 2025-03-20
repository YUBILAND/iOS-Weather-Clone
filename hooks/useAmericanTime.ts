import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

export const useAmericanTime = () => {
  const { americanTime } = useSelector((state: RootState) => state.settings);
  return americanTime;
};
