import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SharedValue } from "react-native-reanimated";
import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import UVIndexCard from "../uv-index/UVIndexCard";
import { iconSize } from "./utils/constants";

interface UVProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const UV = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: UVProps) => {
  const {
    collapseStyle: uvCollapse,
    heightStyle: uvHeight,
    removalOpacityStyle: uvRemoval,
    layoutHeight: uvLayoutHeight,
    onLayout: uvOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(uvLayoutHeight ?? 0);

  return (
    <VisualHeightChange
      onLayout={uvOnLayout}
      layoutHeight={uvLayoutHeight}
      heightAnimation={uvHeight}
      removalAnimation={uvRemoval}
    >
      <UVIndexCard
        cityName={cityName}
        iconSize={iconSize}
        showModal={modalCallbacks.uv}
        collapseFromTopStyle={uvCollapse}
      />
    </VisualHeightChange>
  );
};

export default UV;
