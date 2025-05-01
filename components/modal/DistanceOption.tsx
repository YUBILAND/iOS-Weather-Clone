import { OtherUnitsType } from "@/state/settings/constants";
import React from "react";
import { useChangeOtherUnits } from "../location-modal/unit-modal/hooks/useChangeOtherUnits";
import SettingsTextBoxList from "../location-modal/unit-modal/SettingsTextBoxList";
import { distanceOptionUnitArr } from "../location-modal/unit-modal/utils/constants";

// Component for Displaying Distance Setting Option
const DistanceOption = () => {
  const changeOtherUnits = useChangeOtherUnits();
  const selectOtherUnits = (otherUnit: {
    [key in keyof OtherUnitsType]: string;
  }) => {
    changeOtherUnits(otherUnit);
  };
  return (
    <SettingsTextBoxList
      arr={distanceOptionUnitArr}
      interactableType="dropdown"
      selectedValue="mph"
      onSelect={selectOtherUnits}
      openUpward
    />
  );
};

export default DistanceOption;
