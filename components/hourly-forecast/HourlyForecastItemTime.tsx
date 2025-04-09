import { View, Text } from "react-native";
import React from "react";
import DefaultText from "../atoms/DefaultText";
import { DailyStats } from "./utils/constants";
import { stringToTime } from "@/hooks/hooks";
import { useIs12Hr } from "@/hooks/useIs12Hr";

const timeStringToHourlyFormat = (is12Hr: boolean, timeString: string) => {
  const unformat = stringToTime(is12Hr, timeString, false);

  return is12Hr
    ? unformat.split(":")[0] + unformat.split(" ")[1]
    : unformat.split(":")[0];
};

interface HourlyForecastItemTimeProps {
  hour: DailyStats;
  index: number;
}
const HourlyForecastItemTime = ({
  hour,
  index,
}: HourlyForecastItemTimeProps) => {
  const is12Hr = useIs12Hr();

  return (
    <DefaultText style={{ fontSize: 15, fontWeight: 600 }}>
      {index === 0
        ? "Now"
        : hour.celsius === "Sunrise" || hour.celsius === "Sunset"
        ? stringToTime(is12Hr, hour?.time).split(" ").join("")
        : // : hour?.time.split(":")[0]
          timeStringToHourlyFormat(is12Hr, hour?.time)}
    </DefaultText>
  );
};

export default React.memo(HourlyForecastItemTime);
