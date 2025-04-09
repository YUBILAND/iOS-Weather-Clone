import { colors } from "@/assets/colors/colors";
import { getCurrentTime, getRemainingTimeUntilNextPhase } from "@/hooks/hooks";
import { useWeatherData } from "@/hooks/useWeatherData";
import { RootState } from "@/state/store";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import SunPhaseDraggableTime from "./SunPhaseDraggableTime";
import SunPhaseGraph from "./SunPhaseGraph";
import SunPhaseHeader from "./SunPhaseHeader";
import SunPhaseInfo from "./SunPhaseInfo";
import { getSunPhaseInfo } from "./utils/getSunPhaseInfo";
import { useIs12Hr } from "@/hooks/useIs12Hr";

type SunPhaseModalProps = {
  cityName: string;
  nextPhaseTime: string;
};

const SunPhaseModal = ({ cityName, nextPhaseTime }: SunPhaseModalProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { sunPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const data = useWeatherData();
  const { location } = data[cityName];

  const is12Hr = useIs12Hr();

  const currentTime = getCurrentTime(location?.tz_id);

  const remainingTime = getRemainingTimeUntilNextPhase(
    currentTime,
    nextPhaseTime
  );

  const sunPhaseInfo = getSunPhaseInfo(data[cityName], is12Hr);

  return (
    <View>
      <View className="px-4">
        <View className=" py-4 relative">
          <SunPhaseHeader
            data={data[cityName]}
            isActive={isActive}
            nextPhaseTime={nextPhaseTime}
            remainingTime={remainingTime}
          />

          <SunPhaseDraggableTime
            data={data[cityName]}
            is12Hr={is12Hr}
            state={state}
            isActive={isActive}
          />
        </View>

        <SunPhaseGraph
          cityName={cityName}
          state={state}
          isActive={isActive}
          graphHeight={250}
          strokeWidth={6}
          addBackground
          addLines
        />

        <View
          style={{
            borderWidth: 1,
            borderColor: colors.lightGray,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <SunPhaseInfo sunPhaseInfo={sunPhaseInfo} />
        </View>
      </View>
    </View>
  );
};

export default SunPhaseModal;
