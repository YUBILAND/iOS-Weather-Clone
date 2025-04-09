import DefaultText from "@/components/atoms/DefaultText";
import HorizontalLine from "@/components/atoms/HorizontalLine";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { OtherUnitsType } from "@/state/settings/constants";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import CheckIcon from "./CheckIcon";
import MyOverflowMenu from "./MyOverflowMenu";
import { InteractableType, overflowMenuArr } from "./utils/constants";
import MultipleOptionsIcon from "./MultipleOptionsIcon";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import { Switch } from "react-native-switch";
import { setIs12Hr } from "@/state/settings/settingsSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { storeIs12Hr } from "@/utils/asyncStorage";

interface SettingsTextBoxListProps {
  arr: { name: string; label: string; unit?: string }[];
  interactableType: InteractableType;
  selectedValue: string;
  onSelect: (val: any) => void;
  whichField?: any;
}
const SettingsTextBoxList = ({
  arr,
  interactableType,
  selectedValue,
  onSelect,
}: SettingsTextBoxListProps) => {
  const [visibleUnit, setVisibleUnit] = useState<keyof OtherUnitsType | null>(
    null
  );
  const dispatch = useDispatch<AppDispatch>();

  const is12Hr = useIs12Hr();

  const otherUnits = useOtherUnits();

  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const toggleSwitch = (value: boolean) => {
    // true === 24
    // false == 12
    dispatch(setIs12Hr(value));
    storeIs12Hr(value);
    // setIsEnabled(value);

    console.log("is12Hr is ", is12Hr);
  };

  return arr.map((text, index) => {
    const lastIndex = index === arr.length - 1;

    const handlePress = () => {
      interactableType === "check"
        ? onSelect(text.name)
        : interactableType === "dropdown"
        ? setVisibleUnit(text.name as keyof OtherUnitsType)
        : interactableType === "toggle"
        ? console.log("HI")
        : onSelect(text.name);
    };

    return (
      <React.Fragment key={index}>
        <View>
          {interactableType === "dropdown" && visibleUnit === text.name && (
            <MyOverflowMenu
              visibleUnit={visibleUnit}
              visible={visibleUnit === text.name}
              itemsArr={overflowMenuArr[text.name]}
              itemName={text.name}
              onClickOutside={() => setVisibleUnit(null)}
            />
          )}

          <Pressable
            style={{ zIndex: 0, position: "relative" }}
            onPress={handlePress}
            className="flex-row justify-between items-center "
          >
            <DefaultText style={{ fontSize: 16 }}>{text.label}</DefaultText>

            <View className="mr-6">
              {interactableType === "check" && selectedValue === text.name && (
                <CheckIcon />
              )}

              {interactableType === "toggle" && (
                <Switch
                  // containerStyle={{ overflow: "hidden" }}
                  // trackColor={{ false: "#767577", true: "#81b0ff" }}
                  // thumbColor={true ? "#f5dd4b" : "#f4f3f4"}
                  // ios_backgroundColor="#3e3e3e"
                  // circleActiveColor={"#30a566"}
                  // circleInActiveColor={"#000000"}
                  backgroundActive={"green"}
                  backgroundInactive={"blue"}
                  onValueChange={(value: boolean) => toggleSwitch(value)}
                  value={is12Hr}
                  activeText="12"
                  activeTextStyle={{ fontWeight: 700, fontSize: 16 }}
                  inActiveText="24"
                  inactiveTextStyle={{ fontWeight: 700, fontSize: 16 }}
                />
              )}

              {interactableType === "dropdown" && (
                <MultipleOptionsIcon
                  text={otherUnits[text.name as keyof OtherUnitsType]}
                />
              )}
            </View>
          </Pressable>
        </View>
        {!lastIndex && <HorizontalLine />}
      </React.Fragment>
    );
  });
};

export default React.memo(SettingsTextBoxList);
