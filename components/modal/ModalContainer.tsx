import { colors } from "@/assets/colors/colors";
import React from "react";
import {
  ColorValue,
  Dimensions,
  DimensionValue,
  Modal,
  SafeAreaView,
  ScrollView,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalHeader from "./ModalHeader";
import { iconMap, SelectModal } from "./utils/modalConstants";

Animated.addWhitelistedNativeProps({ value: true, source: true });

type ConditionModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  children: React.ReactNode;
  title?: string;
  selectedModal?: SelectModal;
  backgroundColor?: string;
  putMoonHere?: React.ReactNode;
  topPercentage?: DimensionValue;
  outerColor?: ColorValue;
  innerColor?: ColorValue;
  textColor?: ColorValue;
  onClose?: () => void;
};

const ModalContainer = ({
  modalVisible,
  setModalVisible,
  children,
  title = "",
  selectedModal,
  backgroundColor = colors.darkGray,
  putMoonHere,
  topPercentage = 0,
  outerColor = colors.mediumGray,
  innerColor = colors.lightGray,
  textColor = "white",
  onClose,
}: ConditionModalProps) => {
  const screenHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();

  // Calculate the height (subtract 47 pixels)
  const calculatedHeight = screenHeight - insets.top;

  const IconComponent = selectedModal ? iconMap[selectedModal] : null;

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <SafeAreaView>
        <View
          style={{
            height: calculatedHeight,
            top: topPercentage,
            backgroundColor: backgroundColor,
          }}
        >
          <View className="flex-row items-center justify-between px-6 py-3">
            <ModalHeader
              outerColor={outerColor}
              innerColor={innerColor}
              closeModal={(visible: boolean) => {
                onClose;
                setModalVisible(visible);
              }}
              title={title}
              textColor={textColor}
            >
              {selectedModal && IconComponent && <IconComponent size={28} />}
            </ModalHeader>
          </View>

          <View>{putMoonHere}</View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // contentContainerClassName="w-full h-full"
          >
            <View className="pb-16 ">{children}</View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default React.memo(ModalContainer);
