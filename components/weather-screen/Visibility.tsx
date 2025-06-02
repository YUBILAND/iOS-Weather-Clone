import VisualHeightChange from "@/hooks/VisualHeightChange";
import { getAnimatedStyles } from "@/hooks/getAnimatedStyles";
import React from "react";
import { SharedValue } from "react-native-reanimated";
import VisibilityCard from "../visibility/VisibilityCard";
import { iconSize } from "./utils/constants";

interface VisibilityProps {
  cityName: string;
  scrolledDownShared: SharedValue<number>;
  modalCallbacks: any;
  addCardLayoutHeight?: (layoutHeight: number) => void;
  scrollOffset: number;
  index: number;
}

const Visibility = ({
  cityName,
  scrolledDownShared,
  modalCallbacks,
  addCardLayoutHeight,
  scrollOffset,
  index,
}: VisibilityProps) => {
  const {
    collapseStyle: visCollapse,
    heightStyle: visHeight,
    removalOpacityStyle: visRemoval,
    layoutHeight: visLayoutHeight,
    onLayout: visOnLayout,
  } = getAnimatedStyles(scrolledDownShared, scrollOffset, index);

  if (addCardLayoutHeight) addCardLayoutHeight(visLayoutHeight ?? 0);

  const VisHeightChangeProps = {
    onLayout: visOnLayout,
    layoutHeight: visLayoutHeight,
    heightAnimation: visHeight,
    removalAnimation: visRemoval,
  };

  const VisCardProps = {
    cityName,
    iconSize,
    showModal: modalCallbacks.visibility,
    collapseFromTopStyle: visCollapse,
  };

  return (
    <VisualHeightChange {...VisHeightChangeProps}>
      <VisibilityCard {...VisCardProps} />
    </VisualHeightChange>
  );
};

export default Visibility;
