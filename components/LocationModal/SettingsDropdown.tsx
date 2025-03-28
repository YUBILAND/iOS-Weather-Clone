import { colors } from "@/assets/colors/colors";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { View } from "react-native";
import {
  SelectSetting,
  settingsDropdownObjects,
} from "../modal/utils/modalConstants";
import SettingsDropdownItem from "./SettingsDropdownItem";

interface SettingsDropdownProps {
  isOpen: boolean;
  handleIsOpen: (visible: boolean) => void;
}

export type TempUnit = "celsius" | "fahrenheit";

const SettingsDropdownContainer = ({
  isOpen,
  handleIsOpen,
}: SettingsDropdownProps) => {
  const [selectedTempUnit, setSelectedTempUnit] = useState<TempUnit>("celsius");

  const [selectedSetting, setSelectedSetting] = useState<SelectSetting | null>(
    "celsius"
  );
  const handleSelectedSetting = (selected: SelectSetting | null) => {
    setSelectedSetting(selected);
  };

  const handleSelectedTempUnit = (tempUnit: TempUnit) => {
    setSelectedTempUnit(tempUnit);
  };

  return (
    <>
      {/* View pushes modal dropdown up which looks better than without */}
      {isOpen && (
        <BlurView
          intensity={50}
          style={{ backgroundColor: colors.bgLightGray(0.8) }}
          className="absolute top-20 mt-2 right-0 w-72 rounded-2xl overflow-hidden "
        >
          {Object.entries(settingsDropdownObjects).map(([key, item], index) => {
            const itemProps = {
              item,
              index,
              handleSelectedSetting,
              selectedTempUnit,
              handleSelectedTempUnit,
            };
            return (
              <SettingsDropdownItem
                key={item.id}
                {...itemProps}
                handleIsOpen={(open: boolean) => handleIsOpen(open)}
                settingName={key as SelectSetting}
              />
            );
          })}
        </BlurView>
      )}
    </>
  );
};

export default React.memo(SettingsDropdownContainer);
