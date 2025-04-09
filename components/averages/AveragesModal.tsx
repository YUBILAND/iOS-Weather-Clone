import { RootState } from "@/state/store";
import React, { useEffect } from "react";
import { SharedValue, useAnimatedProps } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import Graph from "../graphs/Graph";
import GraphLeftText from "../graphs/GraphLeftText";
import GraphContainer from "../modal/GraphContainer";
import { getDayArr } from "../precipitation/utils/getDayArr";
import { LeftTextType } from "../modal/Modal";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useSyncAnimatedValue } from "../modal/utils/useSyncedAnimatedValue";
import { updateLeftText } from "../modal/utils/updateLeftText";

interface AveragesModalProps {
  cityName: string;
  currentIndex: number;
  id: number;
  updateShared: (leftText: LeftTextType, id: number) => void;
  isActiveShared: SharedValue<boolean>;
}
const AveragesModal = ({
  cityName,
  currentIndex,
  id,
  updateShared,
  isActiveShared,
}: AveragesModalProps) => {
  const data = useWeatherData();

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

  useSyncAnimatedValue(visIsActive, isActiveShared);

  const currentVisibility = data[cityName].current.vis_miles;

  const dailyVisibilityArr = getDayArr(data[cityName], id, "vis_miles");
  const dailyMax = Math.max(...dailyVisibilityArr);
  const dailyMin = Math.min(...dailyVisibilityArr);

  const currentText: LeftTextType = {
    topText: currentVisibility.toString(),
    topTextSmall: "mi",
    bottomText: "Perfectly Clear",
  };

  const otherText: LeftTextType = {
    topText: dailyMin + " to " + dailyMax,
    topTextSmall: "mi",
    bottomText: "Perfectly Clear",
  };

  updateLeftText(id, updateShared, currentText, otherText);

  // useEffect(() => {
  //   updateLeftText({
  //     currentTopText: currentVisibility.toString() + " mi",
  //     otherTopText: dailyMin + " to " + dailyMax + " mi",
  //     currentBottomText: "Perfectly Clear",
  //     otherBottomText: "Perfectly Clear",
  //   });
  // }, [currentVisibility, dailyMax]);

  return (
    <>
      <GraphContainer
        cityName={cityName}
        state={visState}
        isActive={visIsActive}
        scrollInfoBold={visScrollInfoBold}
        currentIndex={currentIndex}
        leftSide={<></>}
      >
        <Graph
          cityName={cityName}
          // @ts-ignore, used Pick but now sure why it still requires all keys
          state={visState}
          isActive={visIsActive}
          yAxisLabel="mi"
          loadedIndex={id}
          apiObjectString="vis_miles"
          domainTop={10}
          customColor="bgWhite"
          addWeatherText={{ unit: "" }}
        />
      </GraphContainer>
    </>
  );
};

export default AveragesModal;
