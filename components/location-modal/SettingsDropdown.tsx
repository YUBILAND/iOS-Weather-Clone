import { colors } from "@/assets/colors/colors";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  SelectSetting,
  settingsDropdownObjects,
} from "../modal/utils/modalConstants";
import SettingsDropdownItem from "./SettingsDropdownItem";
import UnitModal from "./unit-modal/UnitModal";

interface SettingsDropdownProps {
  isOpen: boolean;
  handleIsOpen: (visible: boolean) => void;
  chooseSetting: (setting: SelectSetting | null) => void;
}

export type TempUnit = "celsius" | "fahrenheit";

const SettingsDropdownContainer = ({
  isOpen,
  handleIsOpen,
  chooseSetting,
}: SettingsDropdownProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModalVisible = (visible: boolean) => {
    setModalVisible(visible);
  };
  return (
    <>
      <UnitModal
        modalVisible={modalVisible}
        setModalVisible={handleModalVisible}
      />

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
            };
            return (
              <SettingsDropdownItem
                key={item.id}
                {...itemProps}
                handleIsOpen={(open: boolean) => handleIsOpen(open)}
                settingName={key as SelectSetting}
                setModalVisible={handleModalVisible}
                chooseSetting={chooseSetting}
              />
            );
          })}
        </BlurView>
      )}
    </>
  );
};

export default React.memo(SettingsDropdownContainer);
