import { deleteData, swapData } from "@/utils/asyncStorage";
import React, {
  ForwardedRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DimensionValue,
  FlatList,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Animated, {
  Easing,
  FadeOutUp,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import DeleteButton from "./DeleteButton";
import LocationCardItem from "./LocationCardItem";
import LocationCardItemContainer from "./LocationCardItemContainer";
import MenuIcon from "./MenuIcon";
import TrashButton from "./TrashButton";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type Item = {
  index: number;
  cityName: string;
};

type Actions = {
  closeSetting: () => void;
  changeWeatherScreens: (weatherScreensArr: string[]) => void;
  handleScroll: (event: any) => void;
  goToWeatherScreen: (screen: number) => void;
  handleConfirmDeleteIndex: (index: number | null) => void;
};

type Customization = {
  topOffset?: number;
  activeScale: number;
  stickyElement: React.ComponentType;
};

type Behavior = {
  isEditingList: boolean;
  confirmDeleteIndex: number | null;
};

interface LocationCardFlatlistProps extends Customization, Actions, Behavior {
  weatherScreens: string[];
  flatlistRef: ForwardedRef<FlatList<Item>>;
}

const LocationCardFlatlist = (props: LocationCardFlatlistProps) => {
  // Actions
  const {
    closeSetting,
    changeWeatherScreens,
    goToWeatherScreen,
    handleScroll,
    handleConfirmDeleteIndex,
  } = props;

  // Customization
  const { topOffset, activeScale, stickyElement } = props;

  // Behavior
  const { isEditingList, confirmDeleteIndex } = props;

  // Others
  const { weatherScreens, flatlistRef } = props;

  const DELETE_BUTTON_SIZE = 28;

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      const firstIndex = item.index === 0;

      const animatedLeftStyle = (() => {
        const left = useSharedValue(0);
        useEffect(() => {
          left.value = withTiming(confirmDeleteIndex === item.index ? -70 : 0);
        }, [confirmDeleteIndex, item.index]);
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                translateX: withTiming(left.value),
              },
            ],
            width: "100%",
          };
        });
        return animatedStyle;
      })();

      const animatedHeightStyle = (() => {
        const height1 = useSharedValue(100);
        useEffect(() => {
          height1.value = withTiming(isEditingList ? 60 : 100, {
            duration: 300,
          });
        }, [isEditingList]);
        const animatedStyle = useAnimatedStyle(() => {
          return {
            height: withTiming(height1.value, { duration: 300 }),
            opacity: isActive ? 0.8 : 1,
            gap: isEditingList ? 8 : 0,
          };
        });
        return animatedStyle;
      })();

      // When trash button is pressed
      const handleRemove = useCallback(() => {
        handleConfirmDeleteIndex(null);
        const newWeatherScreens = weatherScreens.filter(
          (_, idx) => idx !== item.index
        );
        // Ensure deleteData runs *after* `changeWeatherScreens`
        deleteData("city", weatherScreens, item.index); // Remove from storage *after* update
        changeWeatherScreens(newWeatherScreens); // Update the list
      }, [weatherScreens]);

      const ShowDeleteButton = useMemo(() => {
        return React.memo(({ isEditingList }: { isEditingList: boolean }) => {
          return (
            <DeleteButton
              onPress={() => handleConfirmDeleteIndex(item.index)}
              size={DELETE_BUTTON_SIZE}
              isEditingList={isEditingList}
            />
          );
        });
      }, []);

      const ShowHamburgerIcon = useMemo(() => {
        return React.memo(({ isEditingList }: { isEditingList: boolean }) => {
          return (
            <MenuIcon size={DELETE_BUTTON_SIZE} isEditingList={isEditingList} />
          );
        });
      }, []);

      const ShowLocationCards = useMemo(() => {
        return React.memo(({ isEditingList }: { isEditingList: boolean }) => {
          return (
            <LocationCardItemContainer
              closeSetting={closeSetting}
              weatherScreens={weatherScreens}
              idx={item.index}
              goToWeatherScreen={goToWeatherScreen}
              drag={item.index !== 0 ? drag : null}
              isEditingList={isEditingList}
            >
              <LocationCardItem
                city={item.cityName}
                isEditingList={isEditingList}
              />
            </LocationCardItemContainer>
          );
        });
      }, [weatherScreens]);

      const StopDeleteOverlay = useMemo(() => {
        return React.memo(() => {
          return (
            <Pressable
              onPress={() => handleConfirmDeleteIndex(null)}
              className=" w-screen h-screen absolute top-0 left-0"
              style={{ zIndex: 0 }}
            />
          );
        });
      }, []);

      const DeleteLocationCard = useMemo(() => {
        return React.memo(() => {
          return (
            <View className="absolute top-0 left-full ml-4">
              <TrashButton handleRemove={handleRemove} />
            </View>
          );
        });
      }, []);

      const notFirstIndex = !firstIndex;

      return (
        <>
          {
            <Animated.View
              exiting={FadeOutUp.duration(300).easing(Easing.quad)}
              className="relative flex-1"
              style={{ height: isEditingList ? 60 : 100 }}
            >
              {/* ScaleDecorator allows enlarge on hover */}
              <ScaleDecorator activeScale={activeScale}>
                <AnimatedPressable
                  // Expands drag to menu icon
                  onLongPress={drag}
                  disabled={isActive}
                  style={[
                    { zIndex: 0 },
                    animatedHeightStyle,
                    animatedLeftStyle,
                  ]}
                  className="flex-row items-center"
                >
                  {notFirstIndex && (
                    <ShowDeleteButton isEditingList={isEditingList} />
                  )}
                  <ShowLocationCards isEditingList={isEditingList} />
                  {notFirstIndex && (
                    <ShowHamburgerIcon isEditingList={isEditingList} />
                  )}
                  <>
                    {/* Click outside to stop delete */}
                    {confirmDeleteIndex !== null && <StopDeleteOverlay />}
                    {notFirstIndex && isEditingList && <DeleteLocationCard />}
                  </>
                </AnimatedPressable>
              </ScaleDecorator>
            </Animated.View>
          }
        </>
      );
    },
    [weatherScreens, isEditingList, confirmDeleteIndex]
  );

  const handleDragSwap = useCallback(({ data }: { data: Item[] }) => {
    // setData(data);
    changeWeatherScreens(data.map((item) => item.cityName));
    swapData(
      "city",
      data.map((item) => item.cityName)
    );
  }, []);

  const handleScrollChange = useCallback((e: number) => handleScroll(e), []);

  const contentContainerStyle = {
    paddingTop: topOffset,
    rowGap: 8,
    paddingBottom: 80,
    paddingHorizontal: 8,
  };
  const containerStyle = {
    zIndex: 10,
    height: "100%" as DimensionValue,
  };

  const DraggableFlatlistProps = {
    ref: flatlistRef as any,
    data: weatherScreens.map((cityName, index) => ({ index, cityName })),
    onDragEnd: handleDragSwap,
    keyExtractor: (item: Item) => item.cityName,
    renderItem,
    stickyHeaderIndices: [0],
    ListHeaderComponent: stickyElement,
    showsVerticalScrollIndicator: false,
    onScrollOffsetChange: handleScrollChange,
    keyboardShouldPersistTaps: "handled" as const,
    extraData: weatherScreens,
    contentContainerStyle: contentContainerStyle as StyleProp<ViewStyle>,
    containerStyle: containerStyle as StyleProp<ViewStyle>,
    style: { overflowX: "visible" } as StyleProp<ViewStyle>,
    dragItemOverflow: true,
  };
  return (
    <>
      <DraggableFlatList {...DraggableFlatlistProps} />
    </>
  );
};

export default React.memo(LocationCardFlatlist);
