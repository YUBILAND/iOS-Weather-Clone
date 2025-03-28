import { useWeatherData } from "@/hooks/useWeatherData";
import React, { useEffect } from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import { removeZeroFromDecimal } from "../conditions/utils/removeZeroFromDecimal";
import Graph from "../graphs/Graph";
import GraphContainer from "../modal/GraphContainer";
import { LeftTextType } from "../modal/Modal";
import { updateLeftText } from "../modal/utils/updateLeftText";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";

interface PrecipitationModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const PrecipitationModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: PrecipitationModalProps) => {
  const data = useWeatherData();

  const { state: precipState, isActive: precipIsActive } = useChartPressState({
    x: 0,
    y: {
      precip: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const precipScrollInfoBold = useAnimatedProps(() => {
    const precip = `${precipState.y.precip.value.value}"`;
    return {
      text: precip,
      value: precip,
    };
  });

  const totalRainfall =
    data[cityName].forecast.forecastday[id].day.totalprecip_in;

  useSyncAnimatedValue(precipIsActive, isActiveShared);

  const currentText = {
    topText: removeZeroFromDecimal(totalRainfall.toString()) + '"',
    bottomText: "Total in last 24 hours",
  };

  const otherText = {
    topText: removeZeroFromDecimal(totalRainfall.toString()) + '"',
    bottomText: "Total for the day",
  };

  updateLeftText(id, updateShared, currentText, otherText);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={precipState}
        isActive={precipIsActive}
        scrollInfoBold={precipScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={<></>}
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={precipState}
          isActive={precipIsActive}
          yAxisLabel="in"
          loadedIndex={id}
          apiObjectString="precip_in"
          domainTop={1}
          customColor="bgBlue"
          addWeatherImages
        />
      </GraphContainer>
    </>
  );
};

export default PrecipitationModal;
