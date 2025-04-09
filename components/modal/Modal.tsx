import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import HorizontalLine from "../atoms/HorizontalLine";
import RenderConditionsGraphs from "../conditions/RenderConditionsGraphs";
import CalendarScrollView from "./CalendarScrollView";
import ModalDropdownContainer from "./dropdown/ModalDropdownContainer";
import { SelectModal } from "./utils/modalConstants";

import { useWeatherData } from "@/hooks/useWeatherData";
import AirPressureModal from "../air-pressure/AirPressureModal";
import AirPressureModalDescription from "../air-pressure/AirPressureModalDescription";
import ConditionsModalDescription from "../conditions/ConditionsModalDescription";
import GraphLeftText from "../graphs/GraphLeftText";
import HumidityModal from "../humidity/HumidityModal";
import HumidityModalDescription from "../humidity/HumidityModalDescription";
import PrecipitationModal from "../precipitation/PrecipitationModal";
import PrecipitationModalDescription from "../precipitation/PrecipitationModalDescription";
import UVModal from "../uv-index/UVModal";
import UVModalDescription from "../uv-index/UVModalDescription";
import VisibilityModal from "../visibility/VisibilityModal";
import VisibilityModalDescription from "../visibility/VisibilityModalDescription";
import WindChillModal from "../wind-chill/WindChillModal";
import WindChillModalDescription from "../wind-chill/WindChillModalDescription";
import WindModal from "../wind-forecast/WindModal";
import ModalDropdownButton from "./dropdown/ModalDropdownButton";
import AveragesModal from "../averages/AveragesModal";
import AveragesModalDescription from "../averages/AveragesModalDescription";

Animated.addWhitelistedNativeProps({ value: true, source: true });

type ModalProps = {
  cityName: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  currentIndexRef: MutableRefObject<number>;
  selectedModal: SelectModal;
  setSelectedModal: (modal: SelectModal) => void;
  openModalOnIndexRef: MutableRefObject<boolean>;
};

const Modal = ({
  cityName,
  currentIndex,
  setCurrentIndex,
  currentIndexRef,
  selectedModal,
  setSelectedModal,
  openModalOnIndexRef,
}: ModalProps) => {
  const data = useWeatherData();
  const { width } = useWindowDimensions();

  // Hide dropdown button when hovering over graph
  const isActiveShared = useSharedValue(true);
  const [openModalDropdown, setOpenModalDropdown] = useState<boolean>(false);
  const [leftText, setLeftText] = useState<LeftTextType[]>([
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
  ]);

  const leftTextSharedRef = useRef(
    useSharedValue<LeftTextType[]>([
      { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
      { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
      { topText: "No Data", topTextGray: "", bottomText: "No Data", image: "" },
    ])
  );
  const flatlistRef = useRef<FlatList>(null);
  const currentlyScrollingRef = useRef<boolean>(true);
  const enableScrollRef = useRef<boolean>(true);

  const derivedIsActive = useDerivedValue(() => {
    return isActiveShared.value;
  });
  const isBallenActive = useAnimatedStyle(() => {
    return {
      opacity: derivedIsActive.value ? 0 : 1,
    };
  });

  // If user is scrolling, animate the scroll
  if (flatlistRef.current && currentlyScrollingRef.current) {
    flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex });
    currentlyScrollingRef.current = true;
    enableScrollRef.current = true;
  }

  if (flatlistRef.current && openModalOnIndexRef.current) {
    // console.log("current index is ", currentIndex);
    flatlistRef.current.scrollToIndex({ animated: false, index: currentIndex });
    openModalOnIndexRef.current = false;
  }

  const flatlistRenderAmount: { id: number }[] = useMemo(() => {
    return Array(3)
      .fill(0)
      .map((_, idx) => ({ id: idx }));
  }, []);
  const renderItem = useCallback(
    ({ item }: { item: { id: number } }) => {
      return (
        <TouchableWithoutFeedback
          onPressIn={() => handleOpenModalDropdown(false)}
          className="w-screen"
          key={item.id}
        >
          <View className="w-screen">
            {selectedModal === "conditions" ? (
              <React.Fragment key={"conditions"}>
                <RenderConditionsGraphs
                  data={data[cityName]}
                  cityName={cityName}
                  currentIndex={item.id}
                  item={item}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : selectedModal === "uv" ? (
              <React.Fragment key={"uv"}>
                <UVModal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  id={item.id}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : selectedModal === "wind" ? (
              <React.Fragment key={"wind"}>
                <WindModal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  id={item.id}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : selectedModal === "feelsLike" ? (
              <React.Fragment key={"windChill"}>
                <WindChillModal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  id={item.id}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : selectedModal === "precipitation" ? (
              <React.Fragment key={"precipitation"}>
                <PrecipitationModal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  id={item.id}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : selectedModal === "visibility" ? (
              <React.Fragment key={"visibility"}>
                <VisibilityModal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  id={item.id}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : selectedModal === "averages" ? (
              <React.Fragment key={"averages"}>
                <AveragesModal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  id={item.id}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : selectedModal === "humidity" ? (
              <React.Fragment key={"humidity"}>
                <HumidityModal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  id={item.id}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : selectedModal === "airPressure" ? (
              <React.Fragment key={"airPressure"}>
                <AirPressureModal
                  cityName={cityName}
                  currentIndex={currentIndex}
                  id={item.id}
                  updateShared={updateLeftTextShared}
                  isActiveShared={isActiveShared}
                />
              </React.Fragment>
            ) : (
              <View></View>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [openModalDropdown, currentIndex]
  );
  const keyExtractor = useCallback(
    (_: { id: number }, index: number) => index.toString(),
    []
  );

  const handleOpenModalDropdown = (open: boolean) => setOpenModalDropdown(open);
  // Function to update SharedValue
  const updateLeftTextShared = useCallback(
    (newText: LeftTextType, id: number) => {
      runOnUI(() => {
        // Apparently creating a const results in stale comparison so have to
        // modify ref directly to get new reference so setState rerenders
        leftTextSharedRef.current.value = leftTextSharedRef.current.value.map(
          (item, index) => (index === id ? newText : item)
        );
        runOnJS(setLeftText)(leftTextSharedRef.current.value);
      })();
    },
    []
  );

  const handleViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<{
        id: number;
      }>[];
    }) => {
      if (!currentlyScrollingRef.current) {
        //given that only two screens can be visible at a time

        if (viewableItems.length === 2) {
          // when two screens are visible
          const indexOfNextScreen = viewableItems.findIndex(
            (item) => item.index !== currentIndex
          );

          setCurrentIndex(viewableItems[indexOfNextScreen]?.index ?? 0);
        } else if (viewableItems[0].index !== currentIndex) {
          setCurrentIndex(viewableItems[0]?.index ?? 0);
        }
      }
      currentlyScrollingRef.current = false;
    },
    [currentIndex]
  );

  const calendarScrollViewProps = {
    cityName,
    currentIndex,
    setCurrentIndex,
    handleOpenModalDropdown,
  };
  const graphLeftTextProps = {
    leftText,
    selectedModal,
  };
  const modalDropDownProps = {
    selectedModal,
    openModalDropdown,
    handleOpenModalDropdown,
  };
  const flatlistProps = {
    horizontal: true,
    decelerationRate: 0,
    snapToInterval: width, // Use the screen width
    snapToAlignment: "center" as const,
    showsHorizontalScrollIndicator: false,
    pagingEnabled: true,
  };

  return (
    <>
      {selectedModal !== "sunPhase" && (
        <>
          {/* Calendar */}
          <View>
            <CalendarScrollView
              {...calendarScrollViewProps}
              scrollRef={currentlyScrollingRef}
            />

            <HorizontalLine />
          </View>
        </>
      )}

      {/* Popped Up Left Text and Modal Dropdown */}
      <View className="relative">
        <View
          className="absolute top-0 left-0 w-screen flex-row justify-between items-center h-20"
          style={{ paddingHorizontal: 16 }}
        >
          <View className="z-0">
            <Animated.View style={isBallenActive}>
              <GraphLeftText
                {...graphLeftTextProps}
                id={currentIndex}
                leftTextShared={leftTextSharedRef}
              />
            </Animated.View>
          </View>
          <Animated.View className="z-20 relative" style={isBallenActive}>
            <ModalDropdownButton {...modalDropDownProps} />

            <ModalDropdownContainer
              selectedModal={selectedModal}
              setSelectedModal={setSelectedModal}
              isOpen={openModalDropdown}
              handleIsOpen={handleOpenModalDropdown}
            />
          </Animated.View>
        </View>
      </View>

      {/* Graphs */}
      <>
        <FlatList
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
          }}
          {...flatlistProps}
          ref={flatlistRef}
          data={flatlistRenderAmount}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          scrollEnabled={enableScrollRef.current}
          onMomentumScrollEnd={() => {
            enableScrollRef.current = true;
            currentlyScrollingRef.current = false;
          }}
        />
      </>
      <Pressable onPressIn={() => handleOpenModalDropdown(false)}>
        {selectedModal === "uv" ? (
          <UVModalDescription
            data={data[cityName]}
            currentIndex={currentIndex}
          />
        ) : selectedModal === "conditions" ? (
          <ConditionsModalDescription
            data={data[cityName]}
            currentIndex={currentIndex}
          />
        ) : selectedModal === "feelsLike" ? (
          <WindChillModalDescription
            data={data[cityName]}
            currentIndex={currentIndex}
          />
        ) : selectedModal === "precipitation" ? (
          <PrecipitationModalDescription
            data={data[cityName]}
            currentIndex={currentIndex}
          />
        ) : selectedModal === "visibility" ? (
          <VisibilityModalDescription
            data={data[cityName]}
            currentIndex={currentIndex}
          />
        ) : selectedModal === "averages" ? (
          <AveragesModalDescription
            data={data[cityName]}
            currentIndex={currentIndex}
          />
        ) : selectedModal === "humidity" ? (
          <HumidityModalDescription
            data={data[cityName]}
            currentIndex={currentIndex}
          />
        ) : selectedModal === "airPressure" ? (
          <AirPressureModalDescription
            data={data[cityName]}
            currentIndex={currentIndex}
          />
        ) : (
          <View></View>
        )}
      </Pressable>
    </>
  );
};

export type LeftTextType = {
  topText: string;
  topTextSmall?: string;
  topTextGray?: string;
  bottomText: string;
  image?: string;
};

export default React.memo(Modal);
