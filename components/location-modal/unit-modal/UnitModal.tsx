import ModalContainer from "@/components/modal/ModalContainer";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { OtherUnitsType } from "@/state/settings/constants";
import React from "react";
import { View } from "react-native";
import { TempUnit } from "../SettingsDropdown";
import { useChangeIs12Hr } from "./hooks/useChangeIs12Hr";
import { useChangeOtherUnits } from "./hooks/useChangeOtherUnits";
import { useChangeTempUnit } from "./hooks/useChangeTempUnit";
import RestoreDefaults from "./RestoreDefaults";
import SettingsTextBoxContainer from "./SettingsTextBoxContainer";
import SettingsTextBoxList from "./SettingsTextBoxList";
import SmallText from "./SmallText";
import { otherUnitArr, tempUnitArr, timeUnitArr } from "./utils/constants";

interface UnitModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const UnitModal = ({ modalVisible, setModalVisible }: UnitModalProps) => {
  const tempUnit = useTemperatureUnit();
  const otherUnits = useOtherUnits();

  const changeTempUnit = useChangeTempUnit();

  const changeOtherUnits = useChangeOtherUnits();
  const selectOtherUnits = (otherUnit: {
    [key in keyof OtherUnitsType]: string;
  }) => {
    changeOtherUnits(otherUnit);
  };

  const changeIs12Hr = useChangeIs12Hr();

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
            onSelect={selectOtherUnits}
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
