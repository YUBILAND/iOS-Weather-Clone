import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  ImageSourcePropType,
  Pressable,
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
import AveragesModal from "../averages/AveragesModal";
import GraphLeftText from "../graphs/GraphLeftText";
import HumidityModal from "../humidity/HumidityModal";
import PrecipitationModal from "../precipitation/PrecipitationModal";
import UVModal from "../uv-index/UVModal";
import VisibilityModal from "../visibility/VisibilityModal";
import WindChillModal from "../wind-chill/WindChillModal";
import WindModal from "../wind-forecast/WindModal";
import ModalDropdownButton from "./dropdown/ModalDropdownButton";
import ModalDescriptions from "./ModalDescriptions";
import AirQualityModal from "../air-quality/AirQualityModal";
import RainHourModal from "../rain-hour/RainHourModal";
import ModalContainer from "./ModalContainer";
import DefaultText from "../atoms/DefaultText";

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
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: null },
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: null },
    { topText: "No Data", topTextGray: "", bottomText: "No Data", image: null },
  ]);

  const leftTextSharedRef = useRef(
    useSharedValue<LeftTextType[]>([
      {
        topText: "No Data",
        topTextGray: "",
        bottomText: "No Data",
        image: null,
      },
      {
        topText: "No Data",
        topTextGray: "",
        bottomText: "No Data",
        image: null,
      },
      {
        topText: "No Data",
        topTextGray: "",
        bottomText: "No Data",
        image: null,
      },
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

  const flatlistExists = flatlistRef.current;
  const isCurrentlyScrolling = currentlyScrollingRef.current;

  const scrollToThisIndex = (index: number, animated: boolean = true) =>
    flatlistExists!.scrollToIndex({ animated: animated, index: index });

  // If user is scrolling, animate the scroll
  if (flatlistExists && isCurrentlyScrolling) {
    scrollToThisIndex(currentIndex);
    currentlyScrollingRef.current = true;
    enableScrollRef.current = true;
  }

  const openDifferentIndex = openModalOnIndexRef.current;
  if (flatlistExists && openDifferentIndex) {
    scrollToThisIndex(currentIndex, false);
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
          <View className="w-screen px-4">
            {selectedModal === "conditions" ? (
              <React.Fragment key={"conditions"}>
                <RenderConditionsGraphs
                  cityName={cityName}
                  currentIndex={item.id}
                  id={item.id}
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
      const notCurrentlyScrolling = !currentlyScrollingRef.current;
      if (notCurrentlyScrolling) {
        //given that only two screens can be visible at a time
        if (viewableItems.length === 2) {
          // when two screens are visible
          const indexOfNextScreen = viewableItems.findIndex(
            (item) => item.index !== currentIndex
          );
          const nextScreen = viewableItems[indexOfNextScreen];
          setCurrentIndex(nextScreen?.index ?? 0);
        } else if (viewableItems[0].index !== currentIndex) {
          setCurrentIndex(viewableItems[0]?.index ?? 0);
        }
      }
      currentlyScrollingRef.current = false;
    },
    [currentIndex]
  );

  // Props for components
  const CalendarScrollViewProps = {
    cityName,
    currentIndex,
    setCurrentIndex,
    setOpenModalDropdown,
  };
  const GraphLeftTextProps = {
    leftText,
    selectedModal,
  };
  const ModalDropDownProps = {
    selectedModal,
    openModalDropdown,
    setOpenModalDropdown,
  };
  const FlatlistVisualProps = {
    horizontal: true,
    decelerationRate: 0,
    snapToInterval: width, // Use the screen width
    snapToAlignment: "center" as const,
    showsHorizontalScrollIndicator: false,
    pagingEnabled: true,
  };
  const ModalDropdownContainerProps = {
    selectedModal,
    setSelectedModal,
    isOpen: openModalDropdown,
    handleIsOpen: setOpenModalDropdown,
  };
  const FlatListProps = {
    ...FlatlistVisualProps,
    onViewableItemsChanged: handleViewableItemsChanged,
    viewabilityConfig: {
      itemVisiblePercentThreshold: 50,
    },
    ref: flatlistRef,
    data: flatlistRenderAmount,
    keyExtractor: keyExtractor,
    renderItem: renderItem,
    scrollEnabled: enableScrollRef.current,
    onMomentumScrollEnd: () => {
      enableScrollRef.current = true;
      currentlyScrollingRef.current = false;
    },
  };
  const ModalDescriptionProps = {
    data: data[cityName],
    currentIndex,
    selectedModal,
  };

  const excludeCalendarArr = ["airQuality", "sunPhase", "averages", "rainHour"];

  const Calendar = () => {
    return (
      <>
        <CalendarScrollView
          {...CalendarScrollViewProps}
          scrollRef={currentlyScrollingRef}
        />
        <HorizontalLine />
      </>
    );
  };
  const GraphDetailBar = () => {
    return (
      <View className="relative">
        <View
          className="absolute top-0 left-0 w-screen flex-row justify-between items-center h-20"
          style={{ paddingHorizontal: 16 }}
        >
          <View className="z-0">
            <Animated.View style={isBallenActive}>
              <GraphLeftText {...GraphLeftTextProps} id={currentIndex} />
            </Animated.View>
          </View>
          <Animated.View className="z-20 relative" style={isBallenActive}>
            <ModalDropdownButton {...ModalDropDownProps} />

            <ModalDropdownContainer {...ModalDropdownContainerProps} />
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <>
      {!excludeCalendarArr.includes(selectedModal) && <Calendar />}

      {/* Popped Up Left Text and Modal Dropdown */}
      <GraphDetailBar />

      {/* Graphs and FlatList */}
      {!excludeCalendarArr.includes(selectedModal) ? (
        <>
          <View>
            <FlatList {...FlatListProps} />

            {/* For Chance of Precipitation Text in the Conditions */}
            {selectedModal === "conditions" && (
              <View className="absolute top-[280] left-0">
                <View
                  className="h-12 pl-6"
                  style={{ justifyContent: "center" }}
                >
                  <DefaultText className="text-2xl font-semibold ">
                    Chance of Precipitation
                  </DefaultText>
                </View>
              </View>
            )}
          </View>
        </>
      ) : (
        <>
          {selectedModal === "airQuality" && (
            <View className="px-4">
              <AirQualityModal cityName={cityName} />
            </View>
          )}

          {selectedModal === "averages" && (
            <View className="px-4">
              <AveragesModal cityName={cityName} />
            </View>
          )}

          {selectedModal === "rainHour" && (
            <View className="px-4">
              <RainHourModal cityName={cityName} />
            </View>
          )}
        </>
      )}

      <Pressable onPressIn={() => setOpenModalDropdown(false)}>
        <ModalDescriptions {...ModalDescriptionProps} />
      </Pressable>
    </>
  );
};

export type LeftTextType = {
  topText: string;
  topTextSmall?: string;
  topTextGray?: string;
  bottomText: string;
  image?: ImageSourcePropType | null;
};

export default React.memo(Modal);
