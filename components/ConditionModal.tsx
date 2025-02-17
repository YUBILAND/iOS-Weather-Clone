import { View, Text, Modal, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import ModalHeader from "./ModalHeader";
import DefaultText from "./DefaultText";
import { days } from "@/utils/exampleForecast";
import CalendarScrollView from "./CalendarScrollView";
import Chart from "./Chart";

type ConditionModalProps = {
  modalVisible: boolean;
  toggleVisible: () => void;
  cityName: string;
};

const ConditionModal = ({
  modalVisible,
  toggleVisible,
  cityName,
}: ConditionModalProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <SafeAreaView className="">
        <View
          className=" h-screen"
          style={{ backgroundColor: colors.darkGray }}
        >
          <View>
            <View className="flex-row items-center justify-between px-6 pt-4 ">
              <ModalHeader toggleVisible={toggleVisible} />
            </View>

            <CalendarScrollView cityName={cityName} />

            <Text // Horizontal line
              style={{ borderTopWidth: 1, borderTopColor: colors.bgWhite(0.2) }}
            />
          </View>

          <Chart cityName={cityName} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ConditionModal;
