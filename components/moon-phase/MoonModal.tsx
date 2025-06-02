import React, { useCallback, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import ModalContainer from "../modal/ModalContainer";
import { colors } from "@/assets/colors/colors";
import MoonDiagram from "./MoonDiagram";
import MoonPhaseModal from "./MoonPhaseModal";
import { runOnUI, useSharedValue } from "react-native-reanimated";
import { getInitialScrollIndex } from "./utils/getInitialScrollIndex";
import { TICKS_PER_DAY } from "./utils/constants";
import { SelectModal } from "../modal/utils/modalConstants";

interface MoonModalProps {
  cityName: string;
  userScrolledIndex: number;
  setUserScrolledIndex: (index: number) => void;
  ModalContainerProps: {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    selectedModal: SelectModal | undefined;
  };
}
const MoonModal = ({
  cityName,
  userScrolledIndex,
  setUserScrolledIndex,
  ModalContainerProps,
}: MoonModalProps) => {
  const flatlistRef = useRef<FlatList>(null);

  const sharedDate = useSharedValue("");

  const { initialScrollPosition, initialScrollIndex } = getInitialScrollIndex();
  const flatlistPosition = useSharedValue(initialScrollPosition * 12);

  const handleClickMoonArrow = useCallback(() => {
    setUserScrolledIndex(Math.floor(initialScrollIndex));
    runOnUI(() => (flatlistPosition.value = initialScrollPosition * 12))();
    flatlistRef.current?.scrollToIndex({
      index: initialScrollIndex,
      animated: false,
    });
  }, []);

  const MoonDiagramProps = {
    cityName,
    userScrolledIndex,
    handleClickMoonArrow,
    sharedDate,
  };
  const MoonPhaseModalProps = {
    cityName,
    flatlistRef,
    sharedDate,
    flatlistPosition,
    userScrolledIndex,
  };

  return (
    <ModalContainer
      {...ModalContainerProps}
      title={"Moon Phase"}
      backgroundColor={colors.darkGray}
      putMoonHere={<MoonDiagram {...MoonDiagramProps} />}
      onClose={() =>
        flatlistRef?.current?.scrollToIndex({
          animated: false,
          index: initialScrollIndex,
        })
      }
    >
      <MoonPhaseModal
        {...MoonPhaseModalProps}
        setUserScrolledIndex={(index: number) => setUserScrolledIndex(index)}
      />
    </ModalContainer>
  );
};

export default MoonModal;
