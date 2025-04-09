import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import {
  SelectSetting,
  SettingsDropdownObject,
  settingsDropdownObjects,
  settingsIconMap,
} from "../modal/utils/modalConstants";
import { TempUnit } from "./SettingsDropdown";
import DropdownGaps from "../atoms/DropdownGaps";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { setTempUnit } from "@/state/settings/settingsSlice";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { storeTempUnit } from "@/utils/asyncStorage";
import UnitModal from "./unit-modal/UnitModal";

interface SettingsDropdownItemProps {
  item: SettingsDropdownObject;
  index: number;
  handleIsOpen: (open: boolean) => void;
  settingName: SelectSetting;
  setModalVisible: (visible: boolean) => void;
}

const SettingsDropdownItem = ({
  item,
  index,
  handleIsOpen,
  settingName,
  setModalVisible,
}: SettingsDropdownItemProps) => {
  const tempUnit = useTemperatureUnit();
  const dispatch = useDispatch<AppDispatch>();

  const changeTempUnit = (tempUnit: TempUnit) => {
    // Update redux state
    dispatch(setTempUnit(tempUnit));
    // Update asyncStorage
    storeTempUnit(tempUnit);
  };

  const lastIndex = index === Object.keys(settingsDropdownObjects).length - 1;

  const pressDropdownItem = () => {
    // chooseSetting(settingName);
    handleIsOpen(false);
    // Only celsius and fahrenheit should have checkmarks
    if (
      ["celsius", "fahrenheit"].includes(settingName) &&
      tempUnit !== settingName
    ) {
      changeTempUnit(settingName as TempUnit);
    } else {
      // When other settings are pressed
      if (settingName === "units") {
        setModalVisible(true);
        console.log("CLICKED UNITS");
      }
    }
  };

  const IconComponent = settingsIconMap[settingName];

  const gapArr = [1, 3, 4];

  return (
    <Pressable onPress={pressDropdownItem}>
      <View className="flex-row items-center " style={{ paddingVertical: 8 }}>
        <View
          className="flex-[0.1] pl-4"
          style={{ opacity: tempUnit === settingName ? 1 : 0 }}
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
