import { colors } from "@/assets/colors/colors";
import { Location } from "@/constants/constants";
import { BlurView } from "expo-blur";
import React, { RefObject, useCallback, useRef, useState } from "react";
import { FlatList, Modal, Pressable, TextInput, View } from "react-native";
import Search from "../atoms/Search";
import { SelectSetting } from "../modal/utils/modalConstants";
import { Item, LocationCardFlatlist } from "./LocationCardFlatlist";
import SettingsDropdown from "./SettingsDropdown";
import TitleBar from "./TitleBar";
import VisibleText from "./VisibleText";

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
  const handleToggleSearch = useCallback(() => {
    toggleSearch(textInputRef);
    if (flatlistRef.current !== null) {
      flatlistRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
  }, [textInputRef]);
  const handleCancel = () => {
    handleToggleSearch();
  };
  const chooseSetting = (setting: SelectSetting | null) =>
    setSelectedSetting(setting);
  const handleConfirmDeleteIndex = (index: number | null) => {
    setConfirmDeleteIndex(index);
  };

  // Props
  const titleBarProps = {
    handleSettingsModal,
    selectedSetting,
    chooseSetting,
    handleConfirmDeleteIndex,
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

  return (
    <>
      <Modal visible={showLocationModal} transparent animationType="slide">
        <View
          style={{
            backgroundColor: colors.bgBlack(1),
          }}
          className=" h-screen w-screen"
        >
          {/* Absolute View that registers presses for hiding dropdown */}
          {isSettingsOpen && (
            <Pressable
              onPressIn={closeSetting}
              className="absolute w-screen h-screen z-30"
            />
          )}

          {/* Weather Title + Search Component WHEN Scrolled past threshold */}
          <View className="relative">
            <BlurView
              className="absolute top-0 left-0 px-2"
              style={{
                backgroundColor: hasCrossedPoint ? "transparent" : "black",
                display: !showSearch ? "flex" : "none",
                zIndex: 30,
              }}
            >
              <TitleBar
                {...titleBarProps}
                text="Weather"
                visible={hasCrossedPoint}
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
            />
          </View>

          {/* Flatlist */}
          <View style={{ zIndex: 10 }}>
            <LocationCardFlatlist
              {...flatlistProps}
              searchComponent={<Search {...searchProps} />}
              // @ts-ignore expects a component rather than react node but useCallback breaks search functionality
              stickyElement={
                <ListHeader
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
