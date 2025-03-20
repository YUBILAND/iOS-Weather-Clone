import { View, Text } from "react-native";
import React, { useEffect } from "react";
import GraphContainer from "../modal/GraphContainer";
import Graph from "../graphs/Graph";
import { useChartPressState } from "victory-native";
import { useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import WindChillModalDescription from "./WindChillModalDescription";
import { getArr } from "../air-pressure/utils/getAirPressureArr";
import WindChillLeftText from "./WindChillLeftText";

interface WindChillModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  handleActivePress: (active: boolean) => void;
}
const WindChillModal = ({
  cityName,
  currentIndex,
  id,
  handleActivePress,
}: WindChillModalProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

  const { state: windChillState, isActive: windChillIsActive } =
    useChartPressState({
      x: 0,
      y: {
        windChill: 0,
        currentLineTop: 0,
        currentLineBottom: 0,
        currentPosition: 0,
      },
    });
  const windChillScrollInfoBold = useAnimatedProps(() => {
    const windChill = `${Math.round(windChillState.y.windChill.value.value)}°`;
    return {
      text: windChill,
      value: windChill,
    };
  });

  const windChillArr = getArr(data[cityName], "windchill_c");
  const maxRange = Math.max(...windChillArr);
  const minRange = Math.min(...windChillArr);

  useEffect(() => {
    handleActivePress(windChillIsActive);
  }, [windChillIsActive]);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={windChillState}
        isActive={windChillIsActive}
        scrollInfoBold={windChillScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={<WindChillLeftText data={data[cityName]} id={id} />}
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={windChillState}
          isActive={windChillIsActive}
          graphHeight={250}
          strokeWidth={4}
          yAxisLabel="°"
          loadedIndex={id}
          apiObjectString="windchill_c"
          domainBottom={minRange}
          domainTop={maxRange + 10}
          customColor="bgBlue"
          addWeatherImages
        />
      </GraphContainer>

      <WindChillModalDescription data={data[cityName]} currentIndex={id} />
    </>
  );
};

export default WindChillModal;
