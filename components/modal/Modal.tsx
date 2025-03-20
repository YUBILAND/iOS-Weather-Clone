import React, {
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, useWindowDimensions, View, ViewToken } from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import { useChartPressState } from "victory-native";
import HorizontalLine from "../atoms/HorizontalLine";
import RenderConditionsGraphs from "../conditions/RenderConditionsGraphs";
import WindGraph from "../wind-forecast/WindGraph";
import WindLeftText from "../wind-forecast/WindLeftText";
import WindModalDescription from "../wind-forecast/WindModalDescription";
import CalendarScrollView from "./CalendarScrollView";
import ModalDropdownContainer from "./dropdown/ModalDropdownContainer";
import GraphContainer from "./GraphContainer";
import { SelectModal } from "./utils/modalConstants";

import { useWeatherData } from "@/hooks/useWeatherData";
import AirPressureModal from "../air-pressure/AirPressureModal";
import HumidityModal from "../humidity/HumidityModal";
import PrecipitationModal from "../precipitation/PrecipitationModal";
import UVModal from "../uv-index/UVModal";
import VisibilityModal from "../visibility/VisibilityModal";
import WindChillModal from "../wind-chill/WindChillModal";

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

const RenderConditionsGraphsMemo = memo(RenderConditionsGraphs);
const WindGraphMemo = memo(WindGraph);

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

  const { state: windState, isActive: windIsActive } = useChartPressState({
    x: 0,
    y: {
      windSpeed: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
      secondLine: 0,
    },
  });

  const windScrollInfoBold = useAnimatedProps(() => {
    const speedAtIndex = windState.y.windSpeed.value.value;
    const hour = data[cityName].forecast.forecastday[currentIndex].hour;
    const index = windState.x.value.value;
    const windSpeed = `${Math.round(speedAtIndex)} ${
      index < 24 ? hour[index].wind_dir : hour[23].wind_dir
    }`;
    return {
      text: windSpeed,
      value: windSpeed,
    };
  });
  const belowWindScroll = useAnimatedProps(() => {
    const index = windState.x.value.value;
    const hour = data[cityName].forecast.forecastday[currentIndex].hour;
    const gustSpeed = `Gusts: ${
      index < 24
        ? Math.round(hour[index].gust_mph)
        : Math.round(hour[23].gust_mph)
    } mph`;
    return {
      text: gustSpeed,
      value: gustSpeed,
    };
  });

  // Hide dropdown button when hovering over graph

  const [isAnyActive, setIsActive] = useState<boolean>(false);

  const handleActivePress = (active: boolean) => {
    setIsActive(active);
  };

  // Rerender to prevent bug aniamtion when scrolling on mount
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setUpdate(!update);
    });
  }, []);

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
  const buttonScrollActiveRef = useRef<boolean>(false);

  // If user is scrolling, animate the scroll
  if (flatlistRef.current && currentlyScrollingRef.current) {
    // console.log("current index is ", currentIndex);
    flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex });
    currentlyScrollingRef.current = true;
    buttonScrollActiveRef.current = true;
  }

  if (flatlistRef.current && openModalOnIndexRef.current) {
    // console.log("current index is ", currentIndex);
    flatlistRef.current.scrollToIndex({ animated: false, index: currentIndex });
    openModalOnIndexRef.current = false;
  }

  const handleViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<{
        id: number;
      }>[];
    }) => {
      if (!currentlyScrollingRef.current) {
        // console.log("Visible items are", viewableItems[0].index);
        setCurrentIndex(viewableItems[0]?.index ?? 0); // Update state
      }
      currentlyScrollingRef.current = false;
    },
    []
  ); // Empty dependency array means this function is memoized

  const renderItem = ({ item }: { item: { id: number } }) => {
    return (
      <View className="w-screen" key={item.id}>
        {selectedModal === "conditions" ? (
          <React.Fragment key={"conditions"}>
            <RenderConditionsGraphsMemo
              data={data[cityName]}
              cityName={cityName}
              currentIndex={item.id}
              item={item}
              handleActivePress={handleActivePress}
            />
          </React.Fragment>
        ) : selectedModal === "uv" ? (
          <React.Fragment key={"uv"}>
            <UVModal
              cityName={cityName}
              currentIndex={currentIndex}
              id={item.id}
              handleActivePress={handleActivePress}
            />
          </React.Fragment>
        ) : selectedModal === "wind" ? (
          <React.Fragment key={"wind"}>
            <GraphContainer
              cityName={cityName}
              state={windState}
              isActive={windIsActive}
              scrollInfoBold={windScrollInfoBold}
              belowScrollInfo={belowWindScroll}
              currentIndex={currentIndex}
              leftSide={<WindLeftText data={data[cityName]} item={item} />}
            >
              <WindGraphMemo
                cityName={cityName}
                state={windState}
                isActive={windIsActive}
                graphHeight={240}
                strokeWidth={4}
                yAxisLabel=""
                currentIndex={item.id}
              />
            </GraphContainer>
            <WindModalDescription
              data={data[cityName]}
              currentIndex={item.id}
            />
          </React.Fragment>
        ) : selectedModal === "feelsLike" ? (
          <React.Fragment key={"windChill"}>
            <WindChillModal
              cityName={cityName}
              currentIndex={currentIndex}
              id={item.id}
              handleActivePress={handleActivePress}
            />
          </React.Fragment>
        ) : selectedModal === "precipitation" ? (
          <React.Fragment key={"precipitation"}>
            <PrecipitationModal
              cityName={cityName}
              currentIndex={currentIndex}
              id={item.id}
              handleActivePress={handleActivePress}
            />
          </React.Fragment>
        ) : selectedModal === "visibility" ? (
          <React.Fragment key={"visibility"}>
            <VisibilityModal
              cityName={cityName}
              currentIndex={currentIndex}
              id={item.id}
              handleActivePress={handleActivePress}
            />
          </React.Fragment>
        ) : selectedModal === "humidity" ? (
          <React.Fragment key={"humidity"}>
            <HumidityModal
              cityName={cityName}
              currentIndex={currentIndex}
              id={item.id}
              handleActivePress={handleActivePress}
            />
          </React.Fragment>
        ) : selectedModal === "airPressure" ? (
          <React.Fragment key={"airPressure"}>
            <AirPressureModal
              cityName={cityName}
              currentIndex={currentIndex}
              id={item.id}
              handleActivePress={handleActivePress}
            />
          </React.Fragment>
        ) : (
          <View></View>
        )}
        <ModalDropdownContainer
          isAnyActive={isAnyActive}
          selectedModal={selectedModal}
          setSelectedModal={setSelectedModal}
        />
      </View>
    );
  };

  const keyExtractor = useCallback(
    (_: { id: number }, index: number) => index.toString(),
    []
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
            />

            <HorizontalLine />
          </View>
        </>
      )}

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
          scrollEnabled={!buttonScrollActiveRef.current}
          onMomentumScrollEnd={() => {
            buttonScrollActiveRef.current = false;
          }}
        />
      </>
    </>
  );
};

export default Modal;
