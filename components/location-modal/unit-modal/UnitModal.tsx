import ModalContainer from "@/components/modal/ModalContainer";
import React, { useCallback } from "react";
import { View } from "react-native";
import RestoreDefaults from "./RestoreDefaults";
import SettingsTextBoxContainer from "./SettingsTextBoxContainer";
import SettingsTextBoxList from "./SettingsTextBoxList";
import SmallText from "./SmallText";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import {
  storeIs12Hr,
  storeOtherUnits,
  storeTempUnit,
} from "@/utils/asyncStorage";
import { TempUnit } from "../SettingsDropdown";
import {
  setIs12Hr,
  setOtherUnits,
  setTempUnit,
} from "@/state/settings/settingsSlice";
import { OtherUnitsType } from "@/state/settings/constants";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { otherUnitArr, tempUnitArr, timeUnitArr } from "./utils/constants";

interface UnitModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const UnitModal = ({ modalVisible, setModalVisible }: UnitModalProps) => {
  const tempUnit = useTemperatureUnit();
  const otherUnits = useOtherUnits();

  const dispatch = useDispatch<AppDispatch>();

  const changeTempUnit = useCallback((tempUnit: TempUnit) => {
    // Update redux state
    dispatch(setTempUnit(tempUnit));
    // Update asyncStorage
    storeTempUnit(tempUnit);
  }, []);
  const changeIs12Hr = useCallback((is12Hr: boolean) => {
    // Update redux state
    // dispatch(setIs12Hr(is12Hr));
    // storeIs12Hr(is12Hr);
    console.log("chose 12hr? ", is12Hr);
  }, []);
  const changeOtherUnits = useCallback((newOtherUnits: OtherUnitsType) => {
    // Update redux state
    dispatch(setOtherUnits(newOtherUnits));
    storeOtherUnits(newOtherUnits);
    // console.log("newOtherUnits is", otherUnits);
  }, []);

  console.log(otherUnits);

  return (
    <ModalContainer
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title="Unit"
    >
      <View className="px-4">
        <SettingsTextBoxContainer title={"Temperature"}>
          <SettingsTextBoxList
            arr={tempUnitArr}
            selectedValue={tempUnit}
            interactableType="check"
            onSelect={(tempUnit: TempUnit) => changeTempUnit(tempUnit)}
          />
        </SettingsTextBoxContainer>

        <SettingsTextBoxContainer title={"Time"}>
          <SettingsTextBoxList
            arr={timeUnitArr}
            selectedValue={"false"}
            interactableType="toggle"
            onSelect={(is12Hr: boolean) => changeIs12Hr(is12Hr)}
          />
        </SettingsTextBoxContainer>

        <SettingsTextBoxContainer title={"Other Units"}>
          <SettingsTextBoxList
            arr={otherUnitArr}
            interactableType="dropdown"
            selectedValue="mph"
            onSelect={(otherUnits: OtherUnitsType) =>
              changeOtherUnits(otherUnits)
            }
          />
        </SettingsTextBoxContainer>

        <RestoreDefaults />
        <View className="pl-4 pt-2">
          <SmallText text="Set all weather units to the defaults for your region" />
        </View>
      </View>
    </ModalContainer>
  );
};

export default React.memo(UnitModal);
