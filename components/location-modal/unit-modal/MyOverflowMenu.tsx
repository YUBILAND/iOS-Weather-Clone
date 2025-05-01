import { colors } from "@/assets/colors/colors";
import HorizontalLine from "@/components/atoms/HorizontalLine";
import DropdownItem from "@/components/overflow-menu/DropdownItem";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { OtherUnitsType } from "@/state/settings/constants";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View } from "react-native";
import OutsidePressHandler from "react-native-outside-press";

export const shadowViewStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.6,
  shadowRadius: 20,
};

interface MyOverflowMenuProps {
  itemsArr: { name: string; label: string }[];
  itemName: string;
  onClickOutside: () => void;
  onSelect: (otherUnit: {
    [key in any]: string;
  }) => void;
  openUpward?: boolean;
}
const MyOverflowMenu = ({
  itemsArr,
  itemName,
  onClickOutside,
  onSelect,
  openUpward = false,
}: MyOverflowMenuProps) => {
  const otherUnits = useOtherUnits();

  return (
    <OutsidePressHandler
      style={[{ zIndex: 100, borderRadius: 50 }, shadowViewStyle]}
      onOutsidePress={onClickOutside}
    >
      <View>
        <BlurView
          intensity={10}
          className="gap-3 py-3 "
          style={[
            styles.blurView,
            openUpward ? styles.openUpward : styles.openDownward,
          ]}
        >
          {itemsArr.map((item, index) => {
            const lastIndex = index === itemsArr.length - 1;
            return (
              <React.Fragment key={index}>
                <DropdownItem
                  itemName={itemName}
                  name={item.name}
                  label={item.label}
                  handlePress={() => onSelect({ [itemName]: item.name })}
                  showCheckIcon={
                    otherUnits[itemName as keyof OtherUnitsType] === item.name
                  }
                />
                {!lastIndex && <HorizontalLine />}
              </React.Fragment>
            );
          })}
        </BlurView>
      </View>
    </OutsidePressHandler>
  );
};

const styles = StyleSheet.create({
  blurView: {
    backgroundColor: colors.bgMediumGray(1),
    position: "absolute",
    right: 0,
    borderRadius: 10,
    overflow: "hidden",
  },
  openDownward: {
    top: "100%",
    marginTop: 32,
  },
  openUpward: {
    bottom: "100%",
    marginBottom: 20,
  },
});

export default React.memo(MyOverflowMenu);
