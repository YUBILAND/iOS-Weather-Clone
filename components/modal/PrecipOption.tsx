import { OtherUnitsType } from "@/state/settings/constants";
import React from "react";
import { useChangeOtherUnits } from "../location-modal/unit-modal/hooks/useChangeOtherUnits";
import SettingsTextBoxList from "../location-modal/unit-modal/SettingsTextBoxList";
import { precipOptionUnitArr } from "../location-modal/unit-modal/utils/constants";

// Component for Displaying Precipitation Setting Option
const PrecipOption = () => {
  const changeOtherUnits = useChangeOtherUnits();
  const selectOtherUnits = (otherUnit: {
    [key in keyof OtherUnitsType]: string;
  }) => {
    changeOtherUnits(otherUnit);
  };
  return (
    <SettingsTextBoxList
      arr={precipOptionUnitArr}
      interactableType="dropdown"
      selectedValue="mph"
      onSelect={selectOtherUnits}
      openUpward
    />
  );
};

export default PrecipOption;
