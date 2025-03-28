import React, {
  MutableRefObject,
  useCallback,
  useEffect,
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
  useAnimatedGestureHandler,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import HorizontalLine from "../atoms/HorizontalLine";
import RenderConditionsGraphs from "../conditions/RenderConditionsGraphs";
import CalendarScrollView from "./CalendarScrollView";
import ModalDropdownContainer from "./dropdown/ModalDropdownContainer";
import { SelectModal } from "./utils/modalConstants";

import { useWeatherData } from "@/hooks/useWeatherData";
import AirPressureModal from "../air-pressure/AirPressureModal";
import HumidityModal from "../humidity/HumidityModal";
import PrecipitationModal from "../precipitation/PrecipitationModal";
import UVModal from "../uv-index/UVModal";
import VisibilityModal from "../visibility/VisibilityModal";
import WindChillModal from "../wind-chill/WindChillModal";
import WindModal from "../wind-forecast/WindModal";
import GraphLeftText from "../graphs/GraphLeftText";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import DefaultText from "../atoms/DefaultText";
import { useChartPressState } from "victory-native";
import { usePrevious } from "../moon-phase/utils/usePrevious";
import UVModalDescription from "../uv-index/UVModalDescription";
import WindChillModalDescription from "../wind-chill/WindChillModalDescription";
import PrecipitationModalDescription from "../precipitation/PrecipitationModalDescription";
import VisibilityModalDescription from "../visibility/VisibilityModalDescription";
import HumidityModalDescription from "../humidity/HumidityModalDescription";
import AirPressureModalDescription from "../air-pressure/AirPressureModalDescription";
import ConditionsModalDescription from "../conditions/ConditionsModalDescription";
import ModalDropdownButton from "./dropdown/ModalDropdownButton";

Animated.addWhitelistedNativeProps({ value: true, source: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

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

  // Hide dropdown button when hovering over graph
  const [isAnyActive, setIsActive] = useState<boolean>(false);

  const isActiveShared = useSharedValue(true);

  const { state: uvState, isActive: ballenIsActive } = useChartPressState({
    x: 0,
    y: {
      ballen: 0,
    },
  });
  const currentIndexRef1 = useRef<number>(0);

  const derivedIsActive = useDerivedValue(() => {
    // console.log(isActiveShared.value);
    return isActiveShared.value;
  });

  // useAnimatedReaction(
  //   () => {
  //     console.log("Reading Shared Value:", isActiveShared.value); // 🔍 Debug log
  //     return isActiveShared.value;
  //   },
  //   (currentValue, previousValue) => {
  //     if (currentValue !== previousValue) {
  //       console.log("Updated in Parent:", currentValue);
  //     }
  //   }
  // );

  const isBallenActive = useAnimatedStyle(() => {
    // console.log(ballenIsActive);
    return {
      opacity: derivedIsActive.value ? 0 : 1,
    };
  });

  const flatlistRef = useRef<FlatList>(null);

  const flatlistRenderAmount: { id: number }[] = useMemo(() => {
    return Array(3)
      .fill(0)
      .map((_, idx) => ({ id: idx }));
  }, []);

  const { width } = useWindowDimensions();

  const flatlistProps = {
    horizontal: true,
    decelerationRate: 0,
    snapToInterval: width, // Use the screen width
    snapToAlignment: "center" as const,
    showsHorizontalScrollIndicator: false,
    pagingEnabled: true,
  };

  const currentlyScrollingRef = useRef<boolean>(true);
  // Prevent user scroll interrupt when click calendar
  const enableScrollRef = useRef<boolean>(true);

  // If user is scrolling, animate the scroll
  if (flatlistRef.current && currentlyScrollingRef.current) {
    // console.log("current index is ", currentIndex);
    flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex });
    currentlyScrollingRef.current = true;
    enableScrollRef.current = false;
  }

  if (flatlistRef.current && openModalOnIndexRef.current) {
    // console.log("current index is ", currentIndex);
    flatlistRef.current.scrollToIndex({ animated: false, index: currentIndex });
    openModalOnIndexRef.current = false;
  }

  useEffect(() => {
    console.log("Current Index is", currentIndex);
  }, [currentIndex]);

  const [openModalDropdown, setOpenModalDropdown] = useState<boolean>(false);

  const handleOpenModalDropdown = (open: boolean) => setOpenModalDropdown(open);

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
    [openModalDropdown, isAnyActive, currentIndex]
  );

  const keyExtractor = useCallback(
    (_: { id: number }, index: number) => index.toString(),
    []
  );

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

  // Function to update SharedValue
  const fadeOpacity = useSharedValue(1); // Initially fully visible
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

  // const animateFade = (
  //   setIndexBeforeAnimation: () => void,
  //   onFadeOutComplete: () => void
  // ) => {
  //   runOnJS(() => {
  //     setIndexBeforeAnimation();
  //   })();

  //   runOnUI(() => {

  //     const animationDuration = 100;
  //     fadeOpacity.value = withTiming(0, { duration: animationDuration }, () => {
  //       runOnJS(onFadeOutComplete)();
  //       fadeOpacity.value = withDelay(
  //         animationDuration,
  //         withTiming(1, { duration: animationDuration })
  //       );
  //     });
  //   })();
  // };

  const handleViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<{
        id: number;
      }>[];
    }) => {
      // The reason fade opacity is triggering earlier than setCurrentIindex is because
      // the viewableItems array is appended the second visible screen right before the
      // first one disappears so getting the  0th index rather than 1st index will
      // result in going to the same index

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

  return (
    <>
      {selectedModal !== "sunPhase" && (
        <>
          {/* Calendar */}
          <View>
            <CalendarScrollView
              cityName={cityName}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              currentIndexRef={currentIndexRef}
              scrollRef={currentlyScrollingRef}
              handleOpenModalDropdown={handleOpenModalDropdown}
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
                id={currentIndex}
                leftTextShared={leftTextSharedRef}
                leftText={leftText}
                fadeOpacity={fadeOpacity}
                currentIndexRef={currentIndexRef1}
                selectedModal={selectedModal}
              />
            </Animated.View>
          </View>
          <Animated.View className="z-20 relative" style={isBallenActive}>
            <ModalDropdownButton
              selectedModal={selectedModal}
              openModalDropdown={openModalDropdown}
              handleOpenModalDropdown={handleOpenModalDropdown}
            />

            <ModalDropdownContainer
              selectedModal={selectedModal}
              setSelectedModal={setSelectedModal}
              isOpen={openModalDropdown}
              handleIsOpen={handleOpenModalDropdown}
              currentIndex={currentIndex}
              id={currentIndex}
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
