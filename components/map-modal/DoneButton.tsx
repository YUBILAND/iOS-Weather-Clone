import { View, Text, Pressable } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import DefaultText from "../atoms/DefaultText";

interface DoneButtonProps {
  closeMap: () => void;
}
const DoneButton = ({ closeMap }: DoneButtonProps) => {
  return (
    <Pressable style={{ alignSelf: "flex-start" }} onPress={closeMap}>
      <View
        style={{
          backgroundColor: colors.mediumGray,
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <DefaultText className="text-2xl" style={{ fontWeight: 800 }}>
          Done
        </DefaultText>
      </View>
    </Pressable>
  );
};

export default React.memo(DoneButton);
