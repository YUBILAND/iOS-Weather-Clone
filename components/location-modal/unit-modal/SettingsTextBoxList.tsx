import DefaultText from "@/components/atoms/DefaultText";
import HorizontalLine from "@/components/atoms/HorizontalLine";
import { useIs12Hr } from "@/hooks/useIs12Hr";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { OtherUnitsType } from "@/state/settings/constants";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Switch } from "react-native-switch";
import CheckIcon from "./CheckIcon";
import MultipleOptionsIcon from "./MultipleOptionsIcon";
import MyOverflowMenu from "./MyOverflowMenu";
import { InteractableType, overflowMenuArr } from "./utils/constants";

interface SettingsTextBoxListProps {
  arr: { name: string; label: string; unit?: string }[];
  interactableType: InteractableType;
  selectedValue: string;
  onSelect: (val: any) => void;
  openUpward?: boolean;
}
const SettingsTextBoxList = ({
  arr,
  interactableType,
  selectedValue,
  onSelect,
  openUpward = false,
}: SettingsTextBoxListProps) => {
  const [visibleUnit, setVisibleUnit] = useState<keyof OtherUnitsType | null>(
    null
  );

  const is12Hr = useIs12Hr();
  const otherUnits = useOtherUnits();

  return arr.map((text, index) => {
    const lastIndex = index === arr.length - 1;

    const handlePress = () => {
      interactableType === "dropdown"
        ? setVisibleUnit(text.name as keyof OtherUnitsType)
        : onSelect(text.name);
    };

    const selectOverflowMenuElement = (val: any) => {
      onSelect(val);
      setVisibleUnit(null);
    };

    return (
      <React.Fragment key={index}>
        <View>
          {interactableType === "dropdown" && visibleUnit === text.name && (
            <MyOverflowMenu
              itemsArr={overflowMenuArr[text.name]}
              itemName={text.name}
              onClickOutside={() => setVisibleUnit(null)}
              onSelect={selectOverflowMenuElement}
              openUpward={openUpward}
            />
          )}

          <Pressable
            style={{ zIndex: 0, position: "relative" }}
            onPress={handlePress}
            className="flex-row justify-between items-center "
          >
            <DefaultText style={{ fontSize: 16 }}>{text.label}</DefaultText>

            <View style={{ marginRight: 0 }}>
              {interactableType === "check" && selectedValue === text.name && (
                <CheckIcon />
              )}

              {interactableType === "toggle" && (
                <Switch
                  backgroundActive={"green"}
                  backgroundInactive={"blue"}
                  onValueChange={(val: boolean) => onSelect(val)}
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
