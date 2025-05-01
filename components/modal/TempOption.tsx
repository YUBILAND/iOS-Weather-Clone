import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import React from "react";
import { TempUnit } from "../location-modal/SettingsDropdown";
import { useChangeTempUnit } from "../location-modal/unit-modal/hooks/useChangeTempUnit";
import SettingsTextBoxList from "../location-modal/unit-modal/SettingsTextBoxList";
import { tempUnitArr } from "../location-modal/unit-modal/utils/constants";

// Component for Displaying Temperature Setting Option
const TempOption = () => {
  const tempUnit = useTemperatureUnit();
  const changeTempUnit = useChangeTempUnit();
  return (
    <SettingsTextBoxList
      arr={tempUnitArr}
      interactableType="check"
      selectedValue={tempUnit}
      onSelect={(tempUnit: TempUnit) => changeTempUnit(tempUnit)}
      openUpward
    />
  );
};

export default TempOption;
