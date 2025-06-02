import { colors } from "@/assets/colors/colors";
import { Location } from "@/constants/constants";
import { BlurView } from "expo-blur";
import React, {
  memo,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, Modal, Pressable, TextInput, View } from "react-native";
import Search from "../atoms/Search";
import { SelectSetting } from "../modal/utils/modalConstants";
import LocationCardFlatlist, { Item } from "./LocationCardFlatlist";
import SettingsDropdown from "./SettingsDropdown";
import StaticHeader from "./StaticHeader";
import TitleBar from "./TitleBar";

interface LocationModalProps {
  showLocationModal: boolean;
  goToWeatherScreen: (index: number) => void;
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  toggleSearch: (textInputRef: RefObject<TextInput>) => void;
  searchResultLocations: Location[];
  handleAddCity: (location: Location) => void;
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
  handleAddCity,
  weatherScreens,
  changeWeatherScreens,
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
  const flatlistRef = useRef<FlatList<Item>>(null);

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
      // console.log("Threshold crossed!");
    } else if (scrollY <= THRESHOLD) {
      setHasCrossedPoint(false);
      // console.log("Threshold NOT crossed!");
    }
  };

  const handleToggleSearch = useCallback(() => {
    toggleSearch(textInputRef);
    const flatlistExists = flatlistRef.current !== null;
    if (flatlistExists) {
      flatlistRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [textInputRef]);

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
  const handleCancel = () => {
    handleToggleSearch();
  };
  const searchProps = useMemo(
    () => ({
      handleTextDebounce,
      showSearch,
      handleToggleSearch,
      searchResultLocations,
      handleAddCity,
      textInputRef,
      handleCancel,
    }),
    [showSearch]
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

  const Header = memo(() => {
    return (
      <>
        <TitleBar {...titleBarProps} text="Weather" visible={hasCrossedPoint} />
        {hasCrossedPoint && (
          <View className="py-4 ">
            <Search {...searchProps} />
          </View>
        )}
      </>
    );
  });

  const CloseDropdownOverlay = () => {
    return (
      <Pressable
        onPressIn={closeSetting}
        className="absolute w-screen h-screen z-30"
      />
    );
  };

  const Dropdown = () => {
    return (
      <View className="z-30" style={{ paddingBottom: showSearch ? 0 : 44 }}>
        <SettingsDropdown
          isOpen={isSettingsOpen}
          handleIsOpen={handleIsOpen}
          chooseSetting={chooseSetting}
        />
      </View>
    );
  };

  const BlurredHeader = () => {
    return (
      <BlurView
        intensity={hasCrossedPoint ? 20 : 0}
        className="absolute top-0 left-0 px-2"
        style={{
          backgroundColor: hasCrossedPoint ? "transparent" : "black",
          display: !showSearch ? "flex" : "none",
          zIndex: 30,
        }}
      >
        <Header />
      </BlurView>
    );
  };

  return (
    <>
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View
          className="h-screen w-screen"
          style={{
            backgroundColor: colors.bgBlack(1),
          }}
        >
          {isSettingsOpen && <CloseDropdownOverlay />}

          {/* Weather Title + Search Component WHEN Scrolled past threshold */}
          <BlurredHeader />

          {/* Dropdown */}
          <Dropdown />

          {/* Flatlist */}
          <View style={{ zIndex: 10 }}>
            <LocationCardFlatlist
              {...flatlistProps}
              // @ts-ignore expects a component rather than react node but useCallback breaks search functionality
              stickyElement={
                <StaticHeader
                  hasCrossedPoint={hasCrossedPoint}
                  showSearch={showSearch}
                  searchProps={searchProps}
                />
              }
              activeScale={1.03}
              topOffset={60}
              isEditingList={selectedSetting === "editList"}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(LocationModal);
