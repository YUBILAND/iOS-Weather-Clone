import { colors } from "@/assets/colors/colors";
import { useWeatherData } from "@/hooks/useWeatherData";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, StyleProp, View, ViewStyle } from "react-native";
import MapView from "react-native-maps";
import RainMapComponent from "../rain-map/RainMapComponent";
import DoneButton from "./DoneButton";
import PrecipLegend from "./PrecipLegend";

import Slider, { MarkerProps } from "@react-native-community/slider";
import { useTileData } from "../rain-map/utils/useTileData";
import ArrowAndList from "./ArrowAndList";
import CityListModal from "./CityListModal";
import ForecastSelect from "./ForecastSelect";
import Layer from "./Layer";
import PlayPauseIcon from "./PlayPauseIcon";
import ShowMarkers from "./ShowMarkers";
import SliderDate from "./SliderDate";
import CustomStepMarker from "./utils/CustomStepMarker";
import { getDayBoundaryIndex } from "./utils/getDayBoundaryIndex";
import { useIncrementSlider } from "./utils/useIncrementSlider";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useLayout } from "@/hooks/useLayout";

interface MapModalProps {
  currentCardIndex: number;
  cityName: string;
  closeMap: () => void;
  goToWeatherScreen: (index: number) => void;
  weatherScreens: string[];
}

const MapModal = ({
  currentCardIndex,
  cityName,
  closeMap,
  goToWeatherScreen,
  weatherScreens,
}: MapModalProps) => {
  const data = useWeatherData();
  const { location } = data[cityName];

  const [activeIndex, setActiveIndex] = useState(currentCardIndex);
  const [showCities, setShowCities] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [markerSize, setMarkerSize] = useState<"small" | "big">("big");

  const mapRef = useRef<MapView>(null);

  const ZOOM_LEVEL = 4;

  const { epochArr, visibleTileIndex, setVisibleTileIndex } = useTileData();

  // Auto increment slider
  useIncrementSlider(isPlaying, setVisibleTileIndex);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Click Arrow Icon
  const handleRecenter = useCallback((lat: number, lon: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.6 * ZOOM_LEVEL,
        longitudeDelta: 0.3 * ZOOM_LEVEL,
      });
    }
  }, []);
  // Click Individual Marker
  const handleMarkerClick = useCallback(
    (lat: number, lon: number, index: number) => {
      // Recenter on Marker
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.6 * ZOOM_LEVEL,
          longitudeDelta: 0.3 * ZOOM_LEVEL,
        });
      }
      // Activate Marker
      setActiveIndex(index);
    },
    []
  );

  const handleClickListIcon = useCallback(() => {
    setShowCities(true);
    setIsPlaying(false);
  }, [weatherScreens]);

  const pressCity = useCallback((index: number) => {
    goToWeatherScreen(index);
    handleRecenter(
      data[weatherScreens[index]].location.lat,
      data[weatherScreens[index]].location.lon
    );
    setActiveIndex(index);
    setShowCities(false);
    setIsPlaying(true);
  }, []);

  const handleMarkerSize = useCallback((latDelta: number) => {
    const zoomDeltaToChangeMarkerSize = 100;
    latDelta > zoomDeltaToChangeMarkerSize
      ? setMarkerSize("small")
      : setMarkerSize("big");
  }, []);

  const memoizedMarkers = useMemo(
    () => (
      <ShowMarkers
        weatherScreens={weatherScreens}
        activeIndex={activeIndex}
        handleMarkerClick={handleMarkerClick}
        markerSize={markerSize}
      />
    ),
    [weatherScreens, activeIndex, handleMarkerClick, markerSize]
  );

  const ShowSliderDate = useCallback(
    ({ visibleTileIndex }: { visibleTileIndex: number }) => {
      // If we should show yesterdays time
      const { dayBoundaryIndexRef } = getDayBoundaryIndex(epochArr);
      const SliderDateProps = {
        showYesterday: visibleTileIndex < dayBoundaryIndexRef.current,
        epochArr,
        index: visibleTileIndex,
      };
      return <SliderDate {...SliderDateProps} />;
    },
    [visibleTileIndex]
  );

  const CityListModalProps = {
    showCities,
    setShowCities,
    weatherScreens,
    pressCity,
  };

  const handleStepMarker = useCallback(
    (props: MarkerProps) => <CustomStepMarker {...props} epochArr={epochArr} />,
    [epochArr]
  );

  const handleValueChange = useCallback((val: number) => {
    setVisibleTileIndex(val);
  }, []);

  const handleSlidingStart = useCallback(() => setIsPlaying(false), []);

  const barStyle = useMemo(
    () =>
      ({
        width: "100%",
        height: 40,
        paddingBottom: 14,
      } as StyleProp<ViewStyle>),
    []
  );

  const initialValue = 0;
  const max = 0;

  const progress = useSharedValue(initialValue);

  // Animated style for slider thumb (optional, if you want to customize thumb)
  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      // Example: animate thumb scale based on progress
      transform: [{ scale: withTiming(progress.value === max ? 1.2 : 1) }],
    };
  });

  // When external value changes, animate shared value smoothly
  useEffect(() => {
    progress.value = withTiming(initialValue, { duration: 300 });
  }, [initialValue]);

  // Handle slider value change from user interaction
  // const handleChange = (val: number) => {
  //   progress.value = val; // update animated value immediately
  //   runOnJS(onValueChange)(val); // call external callback on JS thread
  // };

  const SliderProps = useMemo(() => {
    console.log("hi");
    return {
      style: barStyle,
      minimumTrackTintColor: "black",
      maximumTrackTintColor: colors.bgBlack(0.2),
      minimumValue: 0,
      maximumValue: 12,
      step: 1,
      // StepMarker: handleStepMarker,
      // value: visibleTileIndex,
      onValueChange: handleValueChange,
      onSlidingStart: handleSlidingStart,
    };
  }, [epochArr]);

  const { layout, onLayout } = useLayout();

  const ShowForecastSliderContainer = useCallback(
    ({
      sliderDate,
      sliderBar,
    }: {
      sliderDate: React.ReactNode;
      sliderBar: React.ReactNode;
    }) => {
      return (
        <View
          className="w-full h-28 absolute bottom-0 left-0 mb-10 px-6"
          style={{ zIndex: 100 }}
        >
          <ForecastSliderContainer>
            <View className="h-full justify-center">
              <View className="flex-row items-center gap-x-8">
                <PlayPauseIcon
                  handlePress={handlePlayPause}
                  isPlaying={isPlaying}
                />
                <View>
                  <ForecastSelect />
                  {sliderDate}
                </View>
              </View>
              {sliderBar}

              {/* <View className="w-full"> */}

              {/* <Animated.View
                onLayout={onLayout}
                style={[
                  {
                    width: 100,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "black",
                  },
                  animatedThumbStyle,
                ]}
              /> */}
              {/* </View> */}
            </View>
          </ForecastSliderContainer>
        </View>
      );
    },
    [layout]
  );

  const ShowDate = useCallback(() => {
    return <ShowSliderDate visibleTileIndex={visibleTileIndex} />;
  }, [visibleTileIndex]);

  const ShowBar = useMemo(() => {
    return <Slider {...SliderProps} value={visibleTileIndex} />;
  }, [visibleTileIndex]);

  const initialRegion = useMemo(
    () => ({
      latitude: location.lat,
      longitude: location.lon,
      latitudeDelta: 0.6 * ZOOM_LEVEL,
      longitudeDelta: 0.3 * ZOOM_LEVEL,
    }),
    []
  );
  const RainMapComponentProps = {
    cityName,
    initialRegion,
    mapRef,
    markers: memoizedMarkers,
    epochArr,
    visibleTileIndex,
    handleMarkerSize,
  };

  return (
    <View className="w-full h-full">
      <CityListModal {...CityListModalProps} />

      <View className="relative" style={{ zIndex: 1 }}>
        <LeftSide>
          <DoneButton closeMap={closeMap} />
          <PrecipLegend cityName={cityName} />
        </LeftSide>

        <RightSide>
          <ArrowAndList
            pressArrow={() => handleRecenter(location.lat, location.lon)}
            pressList={handleClickListIcon}
          />
          <Layer pressLayer={closeMap} />
        </RightSide>
      </View>
      <View className="relative">
        <ShowForecastSliderContainer
          sliderDate={<ShowDate />}
          sliderBar={ShowBar}
        />

        <RainMapComponent {...RainMapComponentProps} />
      </View>
    </View>
  );
};

const LeftSide = ({ children }: { children: React.ReactNode }) => (
  <View className="absolute top-4 left-4 gap-y-4">{children}</View>
);

const RightSide = ({ children }: { children: React.ReactNode }) => (
  <View className="absolute top-4 right-4 gap-y-4">{children}</View>
);

const ForecastSliderContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <View
    className=" w-full h-full px-4 py-4"
    style={{ borderRadius: 20, backgroundColor: colors.bgWhite(0.9) }}
  >
    {children}
  </View>
);

export default React.memo(MapModal);
