import { View, Text, Modal, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import ModalHeader from "./ModalHeader";
import DefaultText from "./DefaultText";
import { days } from "@/utils/exampleForecast";
import CalendarScrollView from "./CalendarScrollView";

type ConditionModalProps = {
  modalVisible: boolean;
  toggleVisible: () => void;
};

const ConditionModal = ({
  modalVisible,
  toggleVisible,
}: ConditionModalProps) => {
  //   const exampleArray = [...Array(15).keys()];

  //   const daysLetter = days.map((day) => day[0]);

  //   const currentIndex = 0;

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

            <CalendarScrollView />

            <Text
              style={{ borderTopWidth: 1, borderTopColor: colors.bgWhite(0.2) }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ConditionModal;
