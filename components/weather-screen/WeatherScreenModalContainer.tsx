import { colors } from "@/assets/colors/colors";
import React from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

Animated.addWhitelistedNativeProps({ value: true, source: true });

type ConditionModalProps = {
  modalVisible: boolean;
  setModalVisible?: (visible: boolean) => void;
  children: React.ReactNode;
  backgroundColor?: string;
};

const WeatherScreenModalContainer = ({
  modalVisible,
  setModalVisible,
  children,
  backgroundColor = colors.darkGray,
}: ConditionModalProps) => {
  const screenHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();

  // Calculate the height (subtract 47 pixels)
  const calculatedHeight = screenHeight - insets.top;

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <SafeAreaView style={{ backgroundColor: colors.bgWhite(0.6) }}>
        <View
          style={{ height: calculatedHeight, backgroundColor: backgroundColor }}
        >
          {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default React.memo(WeatherScreenModalContainer);
