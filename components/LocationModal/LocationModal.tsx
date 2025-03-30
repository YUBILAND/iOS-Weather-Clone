import {
  View,
  Text,
  Modal,
  SafeAreaView,
  Dimensions,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { RefObject, useCallback, useRef, useState } from "react";
import DefaultText from "../atoms/DefaultText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/assets/colors/colors";
import Search from "../atoms/Search";
import { Location } from "@/constants/constants";
import LocationCardContainer from "./LocationCardContainer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import LocationCardItem from "./LocationCardItem";
import LocationCardItemContainer from "./LocationCardItemContainer";
import { useWeatherData } from "@/hooks/useWeatherData";
import { useAmericanTime } from "@/hooks/useAmericanTime";
import { removeZeroFromTimeString } from "@/hooks/hooks";
import { getDayArr } from "../precipitation/utils/getDayArr";
import SettingsDropdown from "./SettingsDropdown";
import { SelectSetting } from "../modal/utils/modalConstants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import DraggableFlatList from "react-native-draggable-flatlist";
import ExampleDragDrop from "./ExampleDragDrop";
import { getLocationCardData } from "./utils/getLocationCardData";
import { Item, LocationCardFlatlist } from "./LocationCardFlatlist";
import VisibleText from "./VisibleText";
import TitleBar from "./TitleBar";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ListHeader = ({
  hasCrossedPoint,
  showSearch,
  searchProps,
}: {
  hasCrossedPoint: boolean;
  showSearch: boolean;
  searchProps: any;
}) => {
  console.log("rerendering?");
  return (
    <>
      {/* Hides when scrolled up  */}
      <VisibleText
        text="Weather"
        visible={hasCrossedPoint}
        exists={!showSearch}
        fontSize={32}
      />

      <BlurView
        // intensity={100}
        className=" py-4 relative z-40 flex-row items-center gap-x-2"
        style={{ opacity: hasCrossedPoint ? 0 : 1 }}
      >
        <Search {...searchProps} />
      </BlurView>
    </>
  );
};

interface LocationModalProps {
  showLocationModal: boolean;
  goToWeatherScreen: (index: number) => void;
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  toggleSearch: (textInputRef: RefObject<TextInput>) => void;
  searchResultLocations: Location[];
  handleLocation: (location: Location) => void;
  weatherScreens: string[];
  changeWeatherScreens: (weatherScreensArr: string[]) => void;
}

const LocationModal = ({
  showLocationModal,
  goToWeatherScreen,
  handleTextDebounce,
  showSearch,
  toggleSearch,
  searchResultLocations,
  handleLocation,
  weatherScreens,
  changeWeatherScreens,
}: LocationModalProps) => {
  const data = useWeatherData();
  const americanTime = useAmericanTime();

  const screenHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();

  // Calculate the height (subtract 47 pixels)
  const calculatedHeight = screenHeight - insets.top;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsModal = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleIsOpen = useCallback((open: boolean) => {
    setIsSettingsOpen(open);
  }, []);

  const closeSetting = useCallback(() => {
    setIsSettingsOpen(false);
    setSelectedSetting(null);
  }, []);

  const [hasCrossedPoint, setHasCrossedPoint] = useState(false);

  const handleScroll = useCallback(
    (scrollOffset: any) => {
      const THRESHOLD = 50;
      const scrollY = scrollOffset;
      if (scrollY >= THRESHOLD && !hasCrossedPoint) {
        setHasCrossedPoint(true);
        console.log("Threshold crossed!");
      } else if (scrollY <= THRESHOLD && hasCrossedPoint) {
        setHasCrossedPoint(false);
        console.log("Threshold NOT crossed!");
      }
    },
    [hasCrossedPoint]
  );

  const textInputRef = useRef<TextInput>(null);
  const handleToggleSearch = useCallback(() => {
    toggleSearch(textInputRef);
    if (flatlistRef.current !== null) {
      flatlistRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [textInputRef]);

  const flatlistRef = useRef<FlatList<Item>>(null);

  const handleCancel = () => {
    handleToggleSearch();
  };

  const searchProps = {
    handleTextDebounce,
    showSearch,
    handleToggleSearch,
    searchResultLocations,
    handleLocation,
    textInputRef,
    handleCancel,
  };

  const StickyHeader = React.memo(() => {
    return (
      <ListHeader
        hasCrossedPoint={hasCrossedPoint}
        showSearch={showSearch}
        searchProps={searchProps}
      />
    );
  });

  const [selectedSetting, setSelectedSetting] = useState<SelectSetting | null>(
    "celsius"
  );

  const chooseSetting = (setting: SelectSetting | null) =>
    setSelectedSetting(setting);

  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );

  const handleConfirmDeleteIndex = (index: number | null) => {
    setConfirmDeleteIndex(index);
    console.log(index);
  };

  return (
    <>
      <Modal visible={showLocationModal} transparent animationType="slide">
        {/* <SafeAreaView> */}

        <View
          style={{
            // height: calculatedHeight,
            backgroundColor: colors.bgBlack(1),
          }}
          className="px-4 h-screen"
        >
          {/* Absolute View that registers presses for hiding dropdown */}
          {isSettingsOpen && (
            <Pressable
              onPressIn={closeSetting}
              className="absolute w-screen h-screen z-30"
            />
          )}

          <View className="relative">
            <BlurView
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: hasCrossedPoint ? "transparent" : "black",
                display: !showSearch ? "flex" : "none",
                zIndex: 30,
              }}
            >
              <TitleBar
                text="Weather"
                visible={hasCrossedPoint}
                handleSettingsModal={handleSettingsModal}
                selectedSetting={selectedSetting}
                chooseSetting={chooseSetting}
                handleConfirmDeleteIndex={handleConfirmDeleteIndex}
              />
              {hasCrossedPoint && (
                <View className="py-4 ">
                  <Search {...searchProps} />
                </View>
              )}
            </BlurView>
          </View>

          {/* Dropdown */}
          <View className="z-30" style={{ paddingBottom: showSearch ? 0 : 44 }}>
            <SettingsDropdown
              isOpen={isSettingsOpen}
              handleIsOpen={handleIsOpen}
              chooseSetting={chooseSetting}
            />
          </View>

          {/* <StickyHeader /> */}

          {/* Flatlist */}
          <View
            // className="absolute top-24 left-0 w-screen"
            style={{ zIndex: 10 }}
          >
            {/* <View className="absolute top-0 left-0">
              <Search {...searchProps} />
            </View> */}

            {/* fix unfocus problem, removing flatlist solves it */}
            {/* <Search {...searchProps} /> */}
            {/* <ExampleDragDrop stickyElement={ListHeader} /> */}

            <LocationCardFlatlist
              stickyElement={StickyHeader}
              activeScale={1.03}
              topOffset={60}
              weatherScreens={weatherScreens}
              closeSetting={closeSetting}
              goToWeatherScreen={goToWeatherScreen}
              handleScroll={handleScroll}
              flatlistRef={flatlistRef}
              isEditingList={selectedSetting === "editList"}
              confirmDeleteIndex={confirmDeleteIndex}
              handleConfirmDeleteIndex={handleConfirmDeleteIndex}
              changeWeatherScreens={changeWeatherScreens}
            />
          </View>
        </View>
        {/* </SafeAreaView> */}
      </Modal>
    </>
  );
};

export default LocationModal;
