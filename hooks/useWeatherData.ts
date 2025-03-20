import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

export const useWeatherData = () => {
  const { data } = useSelector((state: RootState) => state.weather);
  return data;
};
