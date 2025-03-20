import { colors } from "@/assets/colors/colors";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { View } from "react-native";
import ModalDropdownButton from "./ModalDropdownButton";
import { modalDropdownObjects, SelectModal } from "../utils/modalConstants";
import ModalDropdownItem from "./ModalDropdownItem";

interface ModalDropdownProps {
  selectedModal: SelectModal;
  setSelectedModal: (modal: SelectModal) => void;
  isAnyActive: boolean;
}

const ModalDropdownContainer = ({
  selectedModal,
  setSelectedModal,
  isAnyActive,
}: ModalDropdownProps) => {
  const [openModalDropdown, setOpenModalDropdown] = useState<boolean>(false);

  return (
    <View className="absolute right-4 top-5">
      <View className="relative">
        <ModalDropdownButton
          selectedModal={selectedModal}
          isAnyActive={isAnyActive}
          openModalDropdown={openModalDropdown}
          setOpenModalDropdown={(open: boolean) => setOpenModalDropdown(open)}
        />
        {openModalDropdown && (
          <BlurView
            // intensity={50}
            style={{ backgroundColor: colors.bgMediumGray(0.8) }}
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
                  setOpenModalDropdown={(open: boolean) =>
                    setOpenModalDropdown(open)
                  }
                />
              );
            })}
          </BlurView>
        )}
      </View>
    </View>
  );
};

export default ModalDropdownContainer;
