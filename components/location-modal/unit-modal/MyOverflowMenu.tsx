import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";
import { colors } from "@/assets/colors/colors";
import DefaultText from "@/components/atoms/DefaultText";
import HorizontalLine from "@/components/atoms/HorizontalLine";
import { OtherUnitsType } from "@/state/settings/constants";
import { textShadowStyle } from "@/components/WeatherAtLocation";
import CheckIcon from "./CheckIcon";
import DropdownItem from "@/components/overflow-menu/DropdownItem";
import OutsidePressHandler from "react-native-outside-press";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { setOtherUnits } from "@/state/settings/settingsSlice";
import { storeOtherUnits } from "@/utils/asyncStorage";

export const shadowViewStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.6,
  shadowRadius: 20,
};

interface MyOverflowMenuProps {
  visibleUnit: keyof OtherUnitsType | null;
  visible: boolean;
  itemsArr: { name: string; label: string }[];
  itemName: string;
  onClickOutside: () => void;
}
const MyOverflowMenu = ({
  visibleUnit,
  visible,
  itemsArr,
  itemName,
  onClickOutside,
}: MyOverflowMenuProps) => {
  const otherUnits = useOtherUnits();

  const dispatch = useDispatch<AppDispatch>();

  const changeOtherUnits = (newOtherUnits: any) => {
    // Update redux state
    dispatch(setOtherUnits(newOtherUnits));
    storeOtherUnits(newOtherUnits);
    // console.log("newOtherUnits is", otherUnits);
  };

  const handlePress = (unitName: string) => {
    changeOtherUnits({ [itemName]: unitName });
    // console.log({ [itemName]: unitName });
    // console.log("PRESSED", unitName);
  };
  return (
    <OutsidePressHandler
      style={[{ zIndex: 100, borderRadius: 50 }, shadowViewStyle]}
      onOutsidePress={onClickOutside}
    >
      <View>
        <BlurView
          intensity={10}
          className="mt-8 gap-3 py-3 "
          style={styles.blurView}
        >
          {itemsArr.map((item, index) => {
            const lastIndex = index === itemsArr.length - 1;
            return (
              <React.Fragment key={index}>
                <DropdownItem
                  itemName={itemName}
                  name={item.name}
                  label={item.label}
                  handlePress={handlePress}
                  showCheckIcon={
                    otherUnits[itemName as keyof OtherUnitsType] === item.name
                  }
                />
                {!lastIndex && <HorizontalLine />}
              </React.Fragment>

              // <React.Fragment key={index}>
              //   <View className="flex-row px-4 gap-2 items-center pr-8">
              //     <CheckIcon />
              //     <View style={{ maxWidth: 170 }}>
              //       <DefaultText style={{ fontSize: 16 }}>{text}</DefaultText>
              //     </View>
              //   </View>
              //   {!lastIndex && <HorizontalLine />}
              // </React.Fragment>
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
    top: "100%",
    right: 0,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default React.memo(MyOverflowMenu);
