import { RootState } from "@/state/store";
import React, { useEffect } from "react";
import { useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import { getArrAverage } from "../air-pressure/AirPressureModal";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphContainer from "../modal/GraphContainer";
import { getDayArr } from "../precipitation/utils/getDayArr";
import HumidityModalDescription from "./HumidityModalDescription";

interface HumidityModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  handleActivePress: (active: boolean) => void;
}
const HumidityModal = ({
  cityName,
  currentIndex,
  id,
  handleActivePress,
}: HumidityModalProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

  const { state: humidityState, isActive: humidityIsActive } =
    useChartPressState({
      x: 0,
      y: {
        humidity: 0,
        currentLineTop: 0,
        currentLineBottom: 0,
        currentPosition: 0,
      },
    });
  const humidityScrollInfoBold = useAnimatedProps(() => {
    const humidity = `${humidityState.y.humidity.value.value}%`;
    return {
      text: humidity,
      value: humidity,
    };
  });

  useEffect(() => {
    handleActivePress(humidityIsActive);
  }, [humidityIsActive]);

  const currentHumidity = data[cityName].current.humidity;
  const currentDewpoint = data[cityName].current.dewpoint_c;
  const dailyHumidityArr = getDayArr(data[cityName], id, "humidity");
  const average = getArrAverage(dailyHumidityArr);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={humidityState}
        isActive={humidityIsActive}
        scrollInfoBold={humidityScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={
          <GraphLeftText
            id={id}
            currentTopText={Math.round(currentHumidity) + "%"}
            otherTopText={Math.round(average) + "%"}
            currentBottomText={
              "Dew point: " + Math.round(currentDewpoint) + "°"
            }
            otherBottomText="Average"
          />
        }
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={humidityState}
          isActive={humidityIsActive}
          graphHeight={250}
          strokeWidth={4}
          yAxisLabel="%"
          loadedIndex={id}
          apiObjectString="humidity"
          domainBottom={0}
          domainTop={110}
          customColor="bgGreen"
          addWeatherText={{ amount: 4, unit: "%" }}
        />
      </GraphContainer>

      <HumidityModalDescription data={data[cityName]} currentIndex={id} />
    </>
  );
};

export default HumidityModal;
