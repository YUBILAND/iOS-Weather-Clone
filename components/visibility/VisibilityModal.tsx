import { RootState } from "@/state/store";
import React, { useEffect } from "react";
import { useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphContainer from "../modal/GraphContainer";
import { getDayArr } from "../precipitation/utils/getDayArr";
import VisibilityModalDescription from "./VisibilityModalDescription";

interface VisibilityModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  handleActivePress: (active: boolean) => void;
}
const VisibilityModal = ({
  cityName,
  currentIndex,
  id,
  handleActivePress,
}: VisibilityModalProps) => {
  const { data } = useSelector((state: RootState) => state.weather);

  const { state: visState, isActive: visIsActive } = useChartPressState({
    x: 0,
    y: {
      vis: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const visScrollInfoBold = useAnimatedProps(() => {
    const vis = `${visState.y.vis.value.value} mi`;
    return {
      text: vis,
      value: vis,
    };
  });

  useEffect(() => {
    handleActivePress(visIsActive);
  }, [visIsActive]);

  const currentVisibility = data[cityName].current.vis_miles;

  const dailyVisibilityArr = getDayArr(data[cityName], id, "vis_miles");
  const dailyMax = Math.max(...dailyVisibilityArr);
  const dailyMin = Math.min(...dailyVisibilityArr);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={visState}
        isActive={visIsActive}
        scrollInfoBold={visScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={
          <GraphLeftText
            id={id}
            currentTopText={currentVisibility.toString() + " mi"}
            otherTopText={dailyMin + " to " + dailyMax + " mi"}
            currentBottomText="Perfectly Clear"
            otherBottomText="Perfectly Clear"
          />
        }
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={visState}
          isActive={visIsActive}
          graphHeight={250}
          strokeWidth={4}
          yAxisLabel="mi"
          loadedIndex={id}
          apiObjectString="vis_miles"
          domainBottom={0}
          domainTop={10}
          customColor="bgWhite"
          addWeatherText={{ unit: "" }}
        />
      </GraphContainer>

      <VisibilityModalDescription data={data[cityName]} currentIndex={id} />
    </>
  );
};

export default VisibilityModal;
