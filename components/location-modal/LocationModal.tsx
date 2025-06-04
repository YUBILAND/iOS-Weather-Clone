import { colors } from "@/assets/colors/colors";
import { Location } from "@/constants/constants";
import { BlurView } from "expo-blur";
import React, {
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Search from "../atoms/Search";
import { SelectSetting } from "../modal/utils/modalConstants";
import LocationCardFlatlist, { Item } from "./LocationCardFlatlist";
import TitleBar from "./TitleBar";
import VisibleText from "./VisibleText";
import DefaultText from "../atoms/DefaultText";
import SettingsDropdown from "./SettingsDropdown";

interface LocationModalProps {
  showLocationModal: boolean;
  goToWeatherScreen: (index: number) => void;
  searchResultLocations: Location[];
  weatherScreens: string[];
  changeWeatherScreens: (weatherScreensArr: string[]) => void;
  handleSelectLocation: () => void;
  weatherScreenFlatListRef: RefObject<FlatList>;
}

const LocationModal = ({
  showLocationModal,
  goToWeatherScreen,
  searchResultLocations,
  weatherScreens,
  changeWeatherScreens,
  handleSelectLocation,
  weatherScreenFlatListRef,
}: LocationModalProps) => {
  // States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasCrossedPoint, setHasCrossedPoint] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SelectSetting | null>(
    "celsius"
  );
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );

  // Refs
  const textInputRef = useRef<TextInput>(null);
  const flatlistRef = useRef<FlatList>(null);

  // Callbacks
  const openSettingsModal = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);
  const handleIsOpen = (open: boolean) => {
    setIsSettingsOpen(open);
  };
  const closeSetting = () => {
    setIsSettingsOpen(false);
    setSelectedSetting(null);
  };

  const handleScroll = (scrollOffset: number) => {
    const THRESHOLD = 50;
    const scrollY = scrollOffset;

    const crossedThreshold = scrollY >= THRESHOLD;
    if (crossedThreshold) {
      setHasCrossedPoint(true);
    } else if (scrollY <= THRESHOLD) {
      setHasCrossedPoint(false);
    }
  };

  // const handleToggleSearch = useCallback(() => {
  //   toggleSearch(textInputRef);
  //   const flatlistExists = flatlistRef.current !== null;
  //   if (flatlistExists) {
  //     flatlistRef.current.scrollToOffset({ animated: false, offset: 0 });
  //   }
  // }, [textInputRef]);

  const chooseSetting = (setting: SelectSetting | null) => {
    console.log("setting chosen is", setting);
    setSelectedSetting(setting);
  };

  const handleConfirmDeleteIndex = (index: number | null) => {
    setConfirmDeleteIndex(index);
  };
  // Props
  const titleBarProps = {
    openSettingsModal,
    selectedSetting,
    chooseSetting,
    handleConfirmDeleteIndex,
  };

  const searchProps = useMemo(
    () => ({
      weatherScreenFlatListRef,
      searchResultLocations,
      textInputRef,
      handleSelectLocation,
    }),
    []
  );
  const flatlistProps = {
    weatherScreens,
    closeSetting,
    goToWeatherScreen,
    handleScroll,
    flatlistRef,
    confirmDeleteIndex,
    handleConfirmDeleteIndex,
    changeWeatherScreens,
  };

  const CloseDropdownOverlay = () => {
    return (
      <Pressable
        onPressIn={closeSetting}
        style={{ zIndex: 100 }}
        className="absolute w-screen h-screen"
      />
    );
  };

  const LocationModalHeader = () => {
    return (
      <BlurView
        intensity={50}
        className="absolute top-0 left-0 px-2"
        style={{ zIndex: 30 }}
        tint="dark"
      >
        {/* <ScrollView stickyHeaderIndices={[0]} bounces={false}> */}
        <TitleBar {...titleBarProps} text="Weather" visible={hasCrossedPoint} />

        {/* <VisibleText
              text="Weather"
              visible={hasCrossedPoint}
              exists={!showSearch}
              fontSize={32}
            /> */}

        <View
          style={{
            opacity: hasCrossedPoint ? 0 : 1,
            zIndex: 0,
          }}
        >
          <DefaultText style={{ fontSize: 32, fontWeight: 700 }}>
            {"Weather"}
          </DefaultText>
        </View>

        <View className=" py-4 relative z-40 flex-row items-center gap-x-2">
          <Search {...searchProps} />
        </View>
        {/* </ScrollView> */}
      </BlurView>
    );
  };

  const Dropdown = () => {
    return (
      <View style={{ zIndex: 110 }}>
        <SettingsDropdown
          isOpen={isSettingsOpen}
          handleIsOpen={handleIsOpen}
          chooseSetting={chooseSetting}
        />
      </View>
    );
  };

  return (
    <>
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View
          style={{
            backgroundColor: colors.bgBlack(1),
          }}
        >
          {isSettingsOpen && <CloseDropdownOverlay />}

          <LocationModalHeader />

          {isSettingsOpen && <Dropdown />}

          <LocationCardFlatlist
            {...flatlistProps}
            activeScale={1.03}
            topOffset={200}
            isEditingList={selectedSetting === "editList"}
          />
        </View>
      </Modal>
    </>
  );
};

export default React.memo(LocationModal);
