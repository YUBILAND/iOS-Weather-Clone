import { colors } from "@/assets/colors/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import ModalHeader from "./ModalHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iconMap, SelectModal } from "./utils/modalConstants";

Animated.addWhitelistedNativeProps({ value: true, source: true });

type IconName =
  | "sun-o"
  | "moon-o"
  | "cloud"
  | "coffee"
  | "user"
  | "home"
  | "search";
type ConditionModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  children: React.ReactNode;
  title: string;
  selectedModal: SelectModal;
  backgroundColor?: string;
  putMoonHere?: React.ReactNode;
};

const ModalContainer = ({
  modalVisible,
  setModalVisible,
  children,
  title,
  selectedModal,
  backgroundColor = colors.darkGray,
  putMoonHere,
}: ConditionModalProps) => {
  const screenHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();

  // Calculate the height (subtract 47 pixels)
  const calculatedHeight = screenHeight - insets.top;

  const IconComponent = iconMap[selectedModal];

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <SafeAreaView>
        <View
          style={{ height: calculatedHeight, backgroundColor: backgroundColor }}
        >
          <View className="flex-row items-center justify-between px-6 py-3">
            <ModalHeader closeModal={setModalVisible} title={title}>
              <IconComponent size={28} />
            </ModalHeader>
          </View>

          <View>{putMoonHere}</View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="pb-16">{children}</View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalContainer;
