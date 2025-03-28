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

interface LocationModalProps {
  showLocationModal: boolean;
  goToWeatherScreen: (index: number) => void;
  handleTextDebounce: (value: string) => void;
  showSearch: boolean;
  toggleSearch: (textInputRef: RefObject<TextInput>) => void;
  searchResultLocations: Location[];
  handleLocation: (location: Location) => void;
  weatherScreens: string[];
}
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
const LocationModal = ({
  showLocationModal,
  goToWeatherScreen,
  handleTextDebounce,
  showSearch,
  toggleSearch,
  searchResultLocations,
  handleLocation,
  weatherScreens,
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
  }, []);

  const [hasCrossedPoint, setHasCrossedPoint] = useState(false);

  // const handleScroll = useCallback(
  //   (event: any) => {
  //     const THRESHOLD = 38;
  //     const scrollY = event.nativeEvent.contentOffset.y;
  //     if (scrollY >= THRESHOLD && !hasCrossedPoint) {
  //       setHasCrossedPoint(true);
  //       console.log("Threshold crossed!");
  //     } else if (scrollY <= THRESHOLD && hasCrossedPoint) {
  //       setHasCrossedPoint(false);
  //       console.log("Threshold NOT crossed!");
  //     }
  //     console.log(scrollY);
  //   },
  //   [hasCrossedPoint]
  // );

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
      console.log(scrollY);
    },
    [hasCrossedPoint]
  );

  const textInputRef = useRef<TextInput>(null);
  const handleToggleSearch = useCallback(() => {
    toggleSearch(textInputRef);
  }, [textInputRef]);

  const flatlistRef = useRef<FlatList<Item>>(null);

  const handleCancel = useCallback(() => {
    if (flatlistRef.current !== null) {
      flatlistRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
    handleToggleSearch();
  }, [flatlistRef]);

  const searchProps = {
    handleTextDebounce,
    showSearch,
    handleToggleSearch,
    searchResultLocations,
    handleLocation,
    textInputRef,
    handleCancel,
  };

  // const ListHeader = React.memo(() => {
  //   console.log("rerendering?");
  //   return (
  //     <>
  //       {/* Hides when scrolled up  */}
  //       <VisibleText
  //         text="Weather"
  //         visible={hasCrossedPoint}
  //         exists={!showSearch}
  //         fontSize={32}
  //       />

  //       <BlurView
  //         // intensity={100}
  //         className=" py-4 relative z-40 flex-row items-center gap-x-2"
  //         style={{ opacity: hasCrossedPoint ? 0 : 1 }}
  //       >
  //         <Search {...searchProps} />
  //       </BlurView>
  //     </>
  //   );
  // });

  const StickyHeader = React.memo(() => {
    return (
      <ListHeader
        hasCrossedPoint={hasCrossedPoint}
        showSearch={showSearch}
        searchProps={searchProps}
      />
    );
  });

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

          {/* <View className="relative">
            {!showSearch && (
              <BlurView
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: 60,
                  backgroundColor: hasCrossedPoint ? "transparent" : "black",
                }}
                className="w-full flex-row justify-between z-30 items-end"
              >
                <MaterialCommunityIcons
                  name="dots-horizontal-circle-outline"
                  size={24}
                  color="transparent"
                  onPress={handleSettingsModal}
                />
                <DefaultText
                  style={{ opacity: hasCrossedPoint ? 1 : 0 }}
                  className="text-lg"
                >
                  Weather
                </DefaultText>
                <MaterialCommunityIcons
                  name="dots-horizontal-circle-outline"
                  size={24}
                  color={"white"}
                  onPress={handleSettingsModal}
                />
              </BlurView>
            )}
          </View> */}

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
              />
              {hasCrossedPoint && (
                <View className="py-4 ">
                  <Search {...searchProps} />
                </View>
              )}
            </BlurView>
          </View>

          <View className="z-30" style={{ paddingBottom: showSearch ? 0 : 44 }}>
            <SettingsDropdown
              isOpen={isSettingsOpen}
              handleIsOpen={handleIsOpen}
            />
          </View>

          {/* Flatlist */}
          <View
            // className="absolute top-24 left-0 w-screen"
            style={{ zIndex: 10 }}
          >
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
            />
          </View>
        </View>
        {/* </SafeAreaView> */}
      </Modal>
    </>
  );
};

export default LocationModal;
