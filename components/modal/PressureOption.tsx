import { OtherUnitsType } from "@/state/settings/constants";
import React from "react";
import { useChangeOtherUnits } from "../location-modal/unit-modal/hooks/useChangeOtherUnits";
import SettingsTextBoxList from "../location-modal/unit-modal/SettingsTextBoxList";
import { pressureOptionUnitArr } from "../location-modal/unit-modal/utils/constants";

// Component for Displaying Pressure Setting Option
const PressureOption = () => {
  const changeOtherUnits = useChangeOtherUnits();
  const selectOtherUnits = (otherUnit: {
    [key in keyof OtherUnitsType]: string;
  }) => {
    changeOtherUnits(otherUnit);
  };
  return (
    <SettingsTextBoxList
      arr={pressureOptionUnitArr}
      interactableType="dropdown"
      selectedValue="mph"
      onSelect={selectOtherUnits}
      openUpward
    />
  );
};

export default PressureOption;
