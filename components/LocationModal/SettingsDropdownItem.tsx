import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import {
  SelectSetting,
  SettingsDropdownObject,
  settingsIconMap,
} from "../modal/utils/modalConstants";
import { TempUnit } from "./SettingsDropdown";
import DropdownGaps from "../atoms/DropdownGaps";

interface SettingsDropdownItemProps {
  item: SettingsDropdownObject;
  index: number;
  chooseSetting: (setting: SelectSetting | null) => void;
  handleIsOpen: (open: boolean) => void;
  settingName: SelectSetting;
  selectedTempUnit: TempUnit;
  handleSelectedTempUnit: (tempUnit: TempUnit) => void;
}

const SettingsDropdownItem = ({
  item,
  index,
  chooseSetting,
  handleIsOpen,
  settingName,
  selectedTempUnit,
  handleSelectedTempUnit,
}: SettingsDropdownItemProps) => {
  const lastIndex = index === Object.keys(SettingsDropdownItem).length - 1;

  const pressDropdownItem = () => {
    chooseSetting(settingName);
    handleIsOpen(false);
    // Only celsius and fahrenheit should have checkmarks
    if (
      ["celsius", "fahrenheit"].includes(settingName) &&
      selectedTempUnit !== settingName
    ) {
      handleSelectedTempUnit(settingName as TempUnit);
    } else {
    }
  };

  const IconComponent = settingsIconMap[settingName];

  const gapArr = [1, 3, 4];

  return (
    <Pressable onPress={pressDropdownItem}>
      <View className="flex-row items-center " style={{ paddingVertical: 8 }}>
        <View
          className="flex-[0.1] pl-4"
          style={{ opacity: selectedTempUnit === settingName ? 1 : 0 }}
        >
          <Entypo name="check" size={18} color={"white"} />
        </View>
        <DefaultText className=" flex-[0.7] text-lg font-semibold text-white px-2">
          {item.label}
        </DefaultText>
        <View className="flex-[0.3]">
          <View className="items-center">
            <IconComponent />
          </View>
        </View>
      </View>

      {/* {!lastIndex && <HorizontalLine />} */}
      {!lastIndex ? (
        gapArr.includes(index) ? (
          <DropdownGaps />
        ) : (
          <HorizontalLine />
        )
      ) : null}
    </Pressable>
  );
};

export default SettingsDropdownItem;
