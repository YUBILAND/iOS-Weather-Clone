import { colors } from "@/assets/colors/colors";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { View } from "react-native";
import ModalDropdownButton from "./ModalDropdownButton";
import { modalDropdownObjects } from "../utils/constants";
import ModalDropdownItem from "./ModalDropdownItem";

interface ModalDropdownProps {
  selectedModal: number;
  setSelectedModal: (index: number) => void;
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
            //   intensity={50}
            style={{ backgroundColor: colors.bgMediumGray(0.8) }}
            className="absolute top-[100%] mt-2 right-0   w-72 rounded-2xl overflow-hidden "
          >
            {modalDropdownObjects.map((item, index) => {
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
