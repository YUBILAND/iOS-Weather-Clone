import { getScrolledValue } from "@/hooks/getScrolledValue";
import {
  useExtraData,
  useExtraLoading,
  useWeatherData,
} from "@/hooks/useWeatherData";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollView, View } from "react-native";
import TwoCards from "./atoms/TwoCards";
import Modal from "./modal/Modal";
import ModalContainer from "./modal/ModalContainer";
import {
  modalDropdownObjects,
  SelectModal,
} from "./modal/utils/modalConstants";
import MoonModal from "./moon-phase/MoonModal";
import { getInitialScrollIndex } from "./moon-phase/utils/getInitialScrollIndex";
import SunPhaseModal from "./sun-phase/SunPhaseModal";
import Daily from "./weather-screen/Daily";
import LocationHeader from "./weather-screen/LocationHeader";
import { buildCardArray } from "./weather-screen/utils/buildCardArray";
import { gapLength, scrollTopMargin } from "./weather-screen/utils/constants";
import { getStickyIndices } from "./weather-screen/utils/getStickyIndices";
import { getSumOfArray } from "./weather-screen/utils/helperFunctions";
import { useModalArr } from "./weather-screen/utils/useModalArr";

export interface WeatherAtLocationProps {
  cityName: string;
}

const WeatherAtLocation = ({ cityName }: WeatherAtLocationProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedModal, setSelectedModal] = useState<SelectModal | null>(null);

  const currentIndexRef = useRef<number>(0);
  const openModalOnIndexRef = useRef<boolean>(false);

  const { initialScrollIndex } = getInitialScrollIndex();
  const [userScrolledIndex, setUserScrolledIndex] =
    useState(initialScrollIndex);

  // Show rain cards if it is currently raining
  const extraData = useExtraData();
  // const extraLoading = useExtraLoading();
  const rainData = extraData[cityName].rainData;

  const isRainingNextHour = rainData?.some((val) => val !== 0);

  const cardArr = useMemo(
    () => buildCardArray(isRainingNextHour),
    [isRainingNextHour]
  );

  // SCROLLVIEW - Reversed index array for stickyHeaderIndices
  const stickyArr = useMemo(() => getStickyIndices(cardArr), [cardArr]);

  // ANIMATION -  Animated Layout Functions
  const [layoutHeights, setLayoutHeights] = useState<number[]>([]);
  const addToLayoutHeightArr = useCallback(
    (layoutHeight: number) =>
      setLayoutHeights((prev) => [...prev, layoutHeight]),
    []
  );
  const addCardLayoutHeight = useCallback((cardLayoutHeight: number) => {
    useEffect(() => {
      if (cardLayoutHeight) {
        addToLayoutHeightArr(cardLayoutHeight ?? 0);
      }
    }, [cardLayoutHeight]);
  }, []);

  // SCROLLVIEW - Responsible for keeping track of scroll position
  const { scrolledDownShared, handleScroll } = getScrolledValue();

  // MODALS
  const showThisModal = useCallback(
    (modalName: SelectModal, resetIndex: boolean = true) => {
      setSelectedModal(modalName);
      resetIndex && setCurrentIndex(0);
      setModalVisible(true);
    },
    []
  );
  const modalCallbacks = useModalArr(showThisModal);

  const renderCard = useCallback(
    (Card: any, index: number) => {
      const baseProps = {
        cityName,
        scrolledDownShared,
        modalCallbacks,
        addCardLayoutHeight,
        scrollOffset: getSumOfArray(layoutHeights, index),
        index,
      };

      // If Card is array
      const Card1 = Array.isArray(Card) ? Card[0] : Card;
      const Card2 = Array.isArray(Card) ? Card[1] : Card;

      if (Array.isArray(Card)) {
        // Removes addLayoutHeight function so card2 won't double up the layouts
        const { addCardLayoutHeight, ...filteredProps } = baseProps;
        return (
          <TwoCards
            leftCard={<Card1 {...baseProps} />}
            rightCard={<Card2 {...filteredProps} />}
          />
        );
      } else if (Card === Daily) {
        return (
          <Daily
            {...baseProps}
            setCurrentIndex={setCurrentIndex}
            openModalOnIndexRef={openModalOnIndexRef}
          />
        );
      }

      return <Card {...baseProps} />;
    },
    [layoutHeights]
  );
  const RenderCards = useMemo(
    () =>
      cardArr.map((Card, index) => (
        <React.Fragment key={index}>{renderCard(Card, index)}</React.Fragment>
      )),
    [cardArr, renderCard]
  );

  const renderModal = useMemo(() => {
    // MODAL - Props for modals
    const ModalContainerProps = {
      modalVisible,
      setModalVisible,
      // If selectedModal is passed, it cannot be null, thus in those cases SelectedModal is set to undefined
      selectedModal: selectedModal ?? undefined,
    };

    const MoonModalProps = {
      cityName,
      userScrolledIndex,
      setUserScrolledIndex,
      ModalContainerProps,
    };
    const ModalProps = {
      cityName,
      currentIndex,
      setCurrentIndex,
      currentIndexRef,
      setSelectedModal,
      openModalOnIndexRef,
    };

    switch (selectedModal) {
      case "sunPhase":
        return (
          <ModalContainer {...ModalContainerProps} title={"Sun Phase"}>
            <SunPhaseModal cityName={cityName} />
          </ModalContainer>
        );
      case "moonPhase":
        return <MoonModal {...MoonModalProps} />;

      case null:
        return <></>;
      default:
        return (
          <ModalContainer
            {...ModalContainerProps}
            title={modalDropdownObjects[selectedModal].label}
          >
            <Modal {...ModalProps} selectedModal={selectedModal!} />
          </ModalContainer>
        );
    }
  }, [selectedModal, modalVisible, userScrolledIndex, currentIndex]);

  // FLATLIST - Prop for flatlist container
  const contentContainerStyle = {
    gap: gapLength,
    paddingTop: scrollTopMargin,
  };

  console.log("Reloading Weather Screen for", cityName);

  return (
    <>
      <View className="flex-col">
        <LocationHeader
          cityName={cityName}
          scrolledDownShared={scrolledDownShared}
        />

        <ScrollView
          style={{ paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          className="w-screen"
          stickyHeaderIndices={stickyArr}
          contentContainerStyle={contentContainerStyle}
          onScroll={handleScroll}
        >
          {RenderCards}

          {renderModal}
        </ScrollView>
      </View>
    </>
  );
};

export default React.memo(WeatherAtLocation);
