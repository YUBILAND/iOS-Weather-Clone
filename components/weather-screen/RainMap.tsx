import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import React from "react";
import { SharedValue } from "react-native-reanimated";
import { iconSize } from "./utils/constants";
import RainMapCard from "../rain-map/RainMapCard";

interface RainMapProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const RainMap = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: RainMapProps) => {
  const {
    collapseStyle: rainMapCollapse,
    heightStyle: rainMapHeight,
    removalOpacityStyle: rainMapRemoval,
    layoutHeight: rainMapLayoutHeight,
    onLayout: rainMapOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(rainMapLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={rainMapOnLayout}
      layoutHeight={rainMapLayoutHeight}
      heightAnimation={rainMapHeight}
      removalAnimation={rainMapRemoval}
    >
      <RainMapCard
        cityName={cityName}
        iconSize={iconSize}
        // showModal={modalCallbacks.rainmap}
        collapseFromTopStyle={rainMapCollapse}
      />
    </VisualHeightChange>
  );
};

export default RainMap;
