import { RootState } from "@/state/store";
import React, { useEffect } from "react";
import { useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphContainer from "../modal/GraphContainer";
import PrecipitationModalDescription from "./PrecipitationModalDescription";
import { removeZeroFromDecimal } from "../conditions/utils/removeZeroFromDecimal";

interface PrecipitationModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  handleActivePress: (active: boolean) => void;
}
const PrecipitationModal = ({
  cityName,
  currentIndex,
  id,
  handleActivePress,
}: PrecipitationModalProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

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

  useEffect(() => {
    handleActivePress(precipIsActive);
  }, [precipIsActive]);

  const totalRainfall =
    data[cityName].forecast.forecastday[id].day.totalprecip_in;

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={precipState}
        isActive={precipIsActive}
        scrollInfoBold={precipScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={
          <GraphLeftText
            id={id}
            currentTopText={
              removeZeroFromDecimal(totalRainfall.toString()) + '"'
            }
            otherTopText={removeZeroFromDecimal(totalRainfall.toString()) + '"'}
            currentBottomText="Total in last 24 hours"
            otherBottomText="Total for the day"
          />
        }
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={precipState}
          isActive={precipIsActive}
          graphHeight={250}
          strokeWidth={4}
          yAxisLabel="in"
          loadedIndex={id}
          apiObjectString="precip_in"
          domainBottom={0}
          domainTop={1}
          customColor="bgBlue"
          addWeatherImages
        />
      </GraphContainer>

      <PrecipitationModalDescription data={data[cityName]} currentIndex={id} />
    </>
  );
};

export default PrecipitationModal;
