import { colors } from "@/assets/colors/colors";
import DefaultText from "@/components/atoms/DefaultText";
import React from "react";
import { TouchableOpacity } from "react-native";

const RestoreDefaults = () => {
  return (
    <TouchableOpacity
      className="py-4 px-4 rounded-lg"
      style={{ backgroundColor: colors.mediumGray }}
    >
      <DefaultText style={{ color: colors.blue, fontSize: 16 }}>
        Restore Defaults
      </DefaultText>
    </TouchableOpacity>
  );
};

export default RestoreDefaults;
