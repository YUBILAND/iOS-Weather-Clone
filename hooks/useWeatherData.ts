import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

export const useWeatherData = () =>
  useSelector((state: RootState) => state.weather.data, shallowEqual);

export const useExtraData = () =>
  useSelector((state: RootState) => state.weather.extraData, shallowEqual);

export const useExtraLoading = () =>
  useSelector((state: RootState) => state.weather.extraLoading, shallowEqual);
