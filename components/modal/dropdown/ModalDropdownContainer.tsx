import { colors } from "@/assets/colors/colors";
import { BlurView } from "expo-blur";
import React from "react";
import { View } from "react-native";
import { modalDropdownObjects, SelectModal } from "../utils/modalConstants";
import ModalDropdownItem from "./ModalDropdownItem";
import { shadowViewStyle } from "@/components/location-modal/unit-modal/MyOverflowMenu";

interface ModalDropdownProps {
  selectedModal: SelectModal;
  setSelectedModal: (modal: SelectModal) => void;
  isOpen: boolean;
  handleIsOpen: (visible: boolean) => void;
}

const ModalDropdownContainer = ({
  selectedModal,
  setSelectedModal,
  isOpen,
  handleIsOpen,
}: ModalDropdownProps) => {
  return (
    <>
      {/* View pushes modal dropdown up which looks better than without */}
      <View>
        {isOpen && (
          <BlurView
            style={[
              { backgroundColor: colors.bgMediumGray(0.8) },
              shadowViewStyle,
            ]}
            className="absolute top-[100%] mt-2 right-0 w-72 rounded-2xl overflow-hidden "
          >
            {Object.entries(modalDropdownObjects).map(([key, item], index) => {
              const itemProps = {
                item,
                index,
                selectedModal,
                setSelectedModal,
              };
              return (
                <ModalDropdownItem
                  key={item.id}
                  {...itemProps}
                  modalName={key as SelectModal}
                  handleIsOpen={(open: boolean) => handleIsOpen(open)}
                />
              );
            })}
          </BlurView>
        )}
      </View>
    </>
  );
};

export default React.memo(ModalDropdownContainer);
