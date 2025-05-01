import { colors } from "@/assets/colors/colors";
import DefaultText from "@/components/atoms/DefaultText";
import React from "react";
import { TouchableOpacity } from "react-native";
import { usePressDefault } from "./hooks/usePressDefault";

const RestoreDefaults = () => {
  const pressDefault = usePressDefault();
  return (
    <TouchableOpacity
      className="py-4 px-4 rounded-lg"
      style={{ backgroundColor: colors.mediumGray }}
      onPress={pressDefault}
    >
      <DefaultText style={{ color: colors.blue, fontSize: 16 }}>
        Restore Defaults
      </DefaultText>
    </TouchableOpacity>
  );
};

export default React.memo(RestoreDefaults);
