import { colors } from "@/assets/colors/colors";
import { weatherKey } from "@/constants/constants";
import { RootState } from "@/state/store";
import { weatherPNG } from "@/utils/exampleForecast";
import React, {
  memo,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Image,
  useWindowDimensions,
  View,
  Animated as RNAnimated,
  ViewToken,
} from "react-native";
import Animated, { useAnimatedProps } from "react-native-reanimated";
import { shallowEqual, useSelector } from "react-redux";
import { useChartPressState } from "victory-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import TemperatureGraph from "../hourly-forecast/TemperatureGraph";
import CalendarScrollView from "./CalendarScrollView";
import GraphContainer from "./GraphContainer";
import ModalBoxTitle from "./ModalBoxTitle";
import ModalTextBoxContainer from "./ModalTextBoxContainer";
import { getCalendarDate } from "@/hooks/hooks";
import ModalDropdown from "./dropdown/ModalDropdownContainer";
import Test from "@/app/Test";
import DropdownComponent from "./dropdown/DropdownComponent";
import { SelectDemo, SelectDemoItem } from "../atoms/Dropdown";
import ModalDropdownContainer from "./dropdown/ModalDropdownContainer";
import TitleTemp from "../graphs/conditions/TitleTemp";
import UVGraph from "../uv-index/UVGraph";
import GraphLeftText from "../graphs/victoryComponents/GraphLeftText";
import WindLeftText from "../wind-forecast/WindLeftText";
import { SelectModal } from "./utils/modalConstants";
import SunPhaseCard from "../sun-phase/SunPhaseCard";
import SunPhaseGraph from "../sun-phase/SunPhaseGraph";
import WindChillGraph from "../wind-chill/WindChillGraph";
import WindChillLeftText from "../wind-chill/WindChillLeftText";
import PrecipitationGraph from "../precipitation/PrecipitationGraph";
import ConditionsModalDescription from "../conditions/ConditionsModalDescription";
import WindGraph from "../wind-forecast/WindGraph";
import RenderConditionsGraphs from "../conditions/RenderConditionsGraphs";
import UVModalDescription from "../uv-index/UVModalDescription";
import WindModalDescription from "../wind-forecast/WindModalDescription";
import WindChillModalDescription from "../wind-chill/WindChillModalDescription";
import PrecipitationModalDescription from "../precipitation/PrecipitationModalDescription";
import VisibilityGraph from "../visibility/VisibilityGraph";
import Graph from "../graphs/Graph";
import VisibilityLeftText from "../visibility/VisibilityLeftText";
import VisibilityModalDescription from "../visibility/VisibilityModalDescription";
import HumidityGraph from "../humidity/HumidityGraph";
import HumidityLeftText from "../humidity/HumidityLeftText";
import HumidityModalDescription from "../humidity/HumidityModalDescription";

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
  const { state: tempState, isActive: tempIsActive } = useChartPressState({
    x: 0,
    y: {
      celsius: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const { state: rainState, isActive: rainIsActive } = useChartPressState({
    x: 0,
    y: {
      chanceOfRain: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const { state: uvState, isActive: uvIsActive } = useChartPressState({
    x: 0,
    y: {
      uvIndex: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const { state: windState, isActive: windIsActive } = useChartPressState({
    x: 0,
    y: {
      windSpeed: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const { state: windChillState, isActive: windChillIsActive } =
    useChartPressState({
      x: 0,
      y: {
        windChill: 0,
        currentLineTop: 0,
        currentLineBottom: 0,
        currentPosition: 0,
      },
    });
  const { state: precipState, isActive: precipIsActive } = useChartPressState({
    x: 0,
    y: {
      precip: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const { state: visState, isActive: visIsActive } = useChartPressState({
    x: 0,
    y: {
      vis: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });
  const { state: humidityState, isActive: humidityIsActive } =
    useChartPressState({
      x: 0,
      y: {
        humidity: 0,
        currentLineTop: 0,
        currentLineBottom: 0,
        currentPosition: 0,
      },
    });

  const tempScrollInfoBold = useAnimatedProps(() => {
    const celsius = `${Math.round(tempState.y.celsius.value.value)}°`;
    return {
      text: celsius,
      value: celsius,
    };
  });
  const rainScrollInfoBold = useAnimatedProps(() => {
    const chanceOfRain = `${Math.round(rainState.y.chanceOfRain.value.value)}%`;
    return {
      text: chanceOfRain,
      value: chanceOfRain,
    };
  });
  const uvScrollInfoBold = useAnimatedProps(() => {
    const uvIndex = `${Math.round(uvState.y.uvIndex.value.value)}`;
    return {
      text: uvIndex,
      value: uvIndex,
    };
  });
  const windScrollInfoBold = useAnimatedProps(() => {
    const windSpeed = `${Math.round(windState.y.windSpeed.value.value)}mph`;
    return {
      text: windSpeed,
      value: windSpeed,
    };
  });
  const windChillScrollInfoBold = useAnimatedProps(() => {
    const windChill = `${Math.round(windChillState.y.windChill.value.value)}°`;
    return {
      text: windChill,
      value: windChill,
    };
  });
  const precipScrollInfoBold = useAnimatedProps(() => {
    const precip = `${precipState.y.precip.value.value}"`;
    return {
      text: precip,
      value: precip,
    };
  });
  const visScrollInfoBold = useAnimatedProps(() => {
    const vis = `${visState.y.vis.value.value} mi`;
    return {
      text: vis,
      value: vis,
    };
  });
  const humidityScrollInfoBold = useAnimatedProps(() => {
    const humidity = `${humidityState.y.humidity.value.value} %`;
    return {
      text: humidity,
      value: humidity,
    };
  });

  // Hide dropdown button when hovering over graph
  const isAnyActive = [
    tempIsActive,
    rainIsActive,
    uvIsActive,
    windIsActive,
    windChillIsActive,
    precipIsActive,
    visIsActive,
    humidityIsActive,
  ].some((active) => active);

  // Rerender to prevent bug aniamtion when scrolling on mount
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setUpdate(!update);
    });
  }, []);

  const { data } = useSelector((state: RootState) => state.weather);
  const { location, forecast, current } = data[cityName];

  const flatlistRef = useRef<FlatList>(null);

  const flatlistRenderAmount: { id: number }[] = useMemo(() => {
    return Array(3)
      .fill(0)
      .map((_, idx) => ({ id: idx }));
  }, []);

  const { width } = useWindowDimensions();
  // const scrollX = React.useRef(new RNAnimated.Value(0)).current;

  const flatlistProps = {
    horizontal: true,
    decelerationRate: 0,
    snapToInterval: width, // Use the screen width
    snapToAlignment: "center" as const,
    showsHorizontalScrollIndicator: false,
    pagingEnabled: true,
    // onScroll: RNAnimated.event(
    //   [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    //   { useNativeDriver: false }
    // ),
  };

  const currentlyScrollingRef = useRef<boolean>(true);
  // Prevent user scroll interrupt when click calendar
  const buttonScrollActiveRef = useRef<boolean>(false);

  // If user is scrolling, animate the scroll
  if (flatlistRef.current && currentlyScrollingRef.current) {
    console.log("current index is ", currentIndex);
    flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex });
    currentlyScrollingRef.current = true;
    buttonScrollActiveRef.current = true;
  }

  if (flatlistRef.current && openModalOnIndexRef.current) {
    console.log("current index is ", currentIndex);
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
      <View className="w-screen">
        {selectedModal === "temperature" ? (
          <>
            <RenderConditionsGraphs
              data={data[cityName]}
              cityName={cityName}
              tempState={tempState}
              tempIsActive={tempIsActive}
              rainState={rainState}
              rainIsActive={rainIsActive}
              tempScrollInfoBold={tempScrollInfoBold}
              rainScrollInfoBold={rainScrollInfoBold}
              currentIndex={item.id}
              item={item}
            />
            <ConditionsModalDescription
              data={data[cityName]}
              currentIndex={item.id}
            />
          </>
        ) : selectedModal === "uv" ? (
          <>
            <GraphContainer
              cityName={cityName}
              state={uvState}
              isActive={uvIsActive}
              scrollInfoBold={uvScrollInfoBold}
              currentIndex={currentIndex}
              leftSide={<GraphLeftText data={data[cityName]} item={item} />}
            >
              <UVGraph
                cityName={cityName}
                state={uvState}
                isActive={uvIsActive}
                graphHeight={240}
                strokeWidth={4}
                yAxisLabel=""
                currentIndex={item.id}
              />
            </GraphContainer>
            <UVModalDescription data={data[cityName]} currentIndex={item.id} />
          </>
        ) : selectedModal === "wind" ? (
          <>
            <GraphContainer
              cityName={cityName}
              state={windState}
              isActive={windIsActive}
              scrollInfoBold={windScrollInfoBold}
              currentIndex={currentIndex}
              leftSide={<WindLeftText data={data[cityName]} item={item} />}
            >
              <WindGraph
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
          </>
        ) : selectedModal === "windChill" ? (
          <>
            <GraphContainer
              cityName={cityName}
              state={windChillState}
              isActive={windChillIsActive}
              scrollInfoBold={windChillScrollInfoBold}
              currentIndex={currentIndex}
              leftSide={<WindChillLeftText data={data[cityName]} item={item} />}
            >
              <WindChillGraph
                cityName={cityName}
                state={windChillState}
                isActive={windChillIsActive}
                graphHeight={240}
                strokeWidth={4}
                yAxisLabel=""
                currentIndex={item.id}
              />
            </GraphContainer>
            <WindChillModalDescription
              data={data[cityName]}
              currentIndex={item.id}
            />
          </>
        ) : selectedModal === "precipitation" ? (
          <>
            <GraphContainer
              cityName={cityName}
              state={precipState}
              isActive={precipIsActive}
              scrollInfoBold={precipScrollInfoBold}
              currentIndex={currentIndex}
              leftSide={<WindChillLeftText data={data[cityName]} item={item} />}
            >
              <PrecipitationGraph
                cityName={cityName}
                state={precipState}
                isActive={precipIsActive}
                graphHeight={240}
                strokeWidth={4}
                yAxisLabel='"'
                currentIndex={item.id}
              />
            </GraphContainer>
            <PrecipitationModalDescription
              data={data[cityName]}
              currentIndex={item.id}
            />
          </>
        ) : selectedModal === "visibility" ? (
          <>
            <GraphContainer
              cityName={cityName}
              state={visState}
              isActive={visIsActive}
              scrollInfoBold={visScrollInfoBold}
              currentIndex={currentIndex}
              leftSide={
                <VisibilityLeftText data={data[cityName]} item={item} />
              }
            >
              <VisibilityGraph
                cityName={cityName}
                state={visState}
                isActive={visIsActive}
                graphHeight={240}
                strokeWidth={4}
                yAxisLabel="mi"
                currentIndex={item.id}
              />
              {/* <Graph
              cityName={cityName}
              state={visState}
              isActive={visIsActive}
              graphHeight={200}
              strokeWidth={4}
              yAxisLabel={""}
              currentIndex={item.id}
              apiObjectString={"vis_miles"}
              domainBottom={0}
              domainTop={10}
              customColor="bgWhite"
            /> */}
            </GraphContainer>
            <VisibilityModalDescription
              data={data[cityName]}
              currentIndex={item.id}
            />
          </>
        ) : selectedModal === "humidity" ? (
          <>
            <GraphContainer
              cityName={cityName}
              state={humidityState}
              isActive={humidityIsActive}
              scrollInfoBold={humidityScrollInfoBold}
              currentIndex={currentIndex}
              leftSide={<HumidityLeftText data={data[cityName]} item={item} />}
            >
              <HumidityGraph
                cityName={cityName}
                state={humidityState}
                isActive={humidityIsActive}
                graphHeight={240}
                strokeWidth={4}
                yAxisLabel="%"
                currentIndex={item.id}
              />
            </GraphContainer>
            <HumidityModalDescription
              data={data[cityName]}
              currentIndex={item.id}
            />
          </>
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
