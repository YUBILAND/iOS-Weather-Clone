import { deleteData, swapData } from "@/utils/asyncStorage";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import Animated, {
  Easing,
  FadeOutUp,
  useAnimatedStyle,
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

interface LocationCardFlatlistProps {
  weatherScreens: string[];
  closeSetting: () => void;
  goToWeatherScreen: (screen: number) => void;
  topOffset?: number;
  activeScale: number;
  stickyElement: React.ComponentType;
  handleScroll: (event: any) => void;
  flatlistRef: React.RefObject<FlatList<Item>>;
  isEditingList: boolean;
  confirmDeleteIndex: number | null;
  handleConfirmDeleteIndex: (index: number | null) => void;
  changeWeatherScreens: (weatherScreensArr: string[]) => void;
  searchComponent: React.ReactNode;
}

export const LocationCardFlatlist = ({
  weatherScreens,
  closeSetting,
  goToWeatherScreen,
  topOffset,
  activeScale,
  stickyElement,
  handleScroll,
  flatlistRef,
  isEditingList,
  confirmDeleteIndex,
  handleConfirmDeleteIndex,
  changeWeatherScreens,
  searchComponent,
}: LocationCardFlatlistProps) => {
  const initialData: Item[] = useMemo(() => {
    return [...Array(weatherScreens.length)].map((d, index) => {
      return {
        index: index,
        cityName: weatherScreens[index],
      };
    });
  }, [weatherScreens, isEditingList]);

  const [data, setData] = useState(initialData);
  useEffect(() => {
    setData(initialData);
  }, [isEditingList, weatherScreens]);

  const DELETE_BUTTON_SIZE = 28;

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      const firstIndex = item.index === 0;

      const left = useSharedValue(0);
      const animatedStyle = useAnimatedStyle(() => {
        left.value = confirmDeleteIndex === item.index ? -70 : 0;
        return {
          // position: "absolute",
          // top: 0,
          // left: 0,
          // height: "100%",
          transform: [
            {
              translateX: withTiming(left.value),
            },
          ],
          width: "100%",
          // flex: 1,
        };
      });

      const height1 = useSharedValue(100);
      const animatedStyle1 = useAnimatedStyle(() => {
        height1.value = isEditingList ? 60 : 100;

        return {
          height: withTiming(height1.value, { duration: 300 }),
          opacity: isActive ? 0.8 : 1,
          gap: isEditingList ? 8 : 0,
        };
      });

      const showTrashButton = () => handleConfirmDeleteIndex(item.index);

      // When trash button is pressed
      const handleRemove = () => {
        handleConfirmDeleteIndex(null);
        const newWeatherScreens = weatherScreens.filter(
          (_, idx) => idx !== item.index
        );
        // Ensure deleteData runs *after* `changeWeatherScreens`
        deleteData("city", weatherScreens, item.index); // Remove from storage *after* update
        changeWeatherScreens(newWeatherScreens); // Update the list
      };

      return (
        <>
          {/* {remove !== item.index && ( */}
          {weatherScreens.includes(item.cityName) && (
            <Animated.View
              exiting={FadeOutUp.duration(300).easing(Easing.quad)}
              className="relative flex-1"
              style={{ height: isEditingList ? 60 : 100 }}
            >
              {/* ScaleDecorator allows enlarge on hover */}
              <ScaleDecorator activeScale={activeScale}>
                <Animated.View className="relative" style={animatedStyle}>
                  <Animated.View style={[animatedStyle1]}>
                    <AnimatedPressable
                      // Expands drag to menu icon
                      onLongPress={drag}
                      disabled={isActive}
                      style={[{ zIndex: 0 }, animatedStyle1]}
                      className="flex-row items-center"
                    >
                      {!firstIndex && (
                        <DeleteButton
                          onPress={showTrashButton}
                          size={DELETE_BUTTON_SIZE}
                          isEditingList={isEditingList}
                        />
                      )}
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
                      {!firstIndex && (
                        // Manually add gap to the right since trash button is not in flex-row
                        <View>
                          <MenuIcon
                            size={DELETE_BUTTON_SIZE}
                            isEditingList={isEditingList}
                          />
                        </View>
                      )}
                      <>
                        {/* Click outside to stop delete */}
                        {confirmDeleteIndex !== null && (
                          <Pressable
                            onPress={() => handleConfirmDeleteIndex(null)}
                            className=" w-screen h-screen absolute top-0 left-0"
                            style={{ zIndex: 0 }}
                          />
                        )}
                        {!firstIndex && isEditingList && (
                          <View className="absolute top-0 left-full ml-4">
                            <TrashButton handleRemove={handleRemove} />
                          </View>
                        )}
                      </>
                    </AnimatedPressable>
                    {/* </Animated.View> */}
                  </Animated.View>
                </Animated.View>
                {/* </View> */}
              </ScaleDecorator>
            </Animated.View>
          )}
        </>
      );
    },
    [weatherScreens, isEditingList, confirmDeleteIndex]
  );

  const handleDragSwap = ({ data }: { data: Item[] }) => {
    setData(data);
    changeWeatherScreens(data.map((item) => item.cityName));
    swapData(
      "city",
      data.map((item) => item.cityName)
    );
  };

  return (
    <>
      <DraggableFlatList
        // @ts-ignore not sure which type ref object it requires
        ref={flatlistRef}
        data={data}
        onDragEnd={handleDragSwap}
        keyExtractor={(item) => item.index.toString()}
        renderItem={renderItem}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={stickyElement}
        showsVerticalScrollIndicator={false}
        onScrollOffsetChange={(e) => handleScroll(e)}
        keyboardShouldPersistTaps="handled"
        extraData={weatherScreens}
        contentContainerStyle={{
          paddingTop: topOffset,
          rowGap: 8,
          paddingBottom: 80,
          paddingHorizontal: 8,
        }}
        containerStyle={{
          zIndex: 10,
          height: "100%",
        }}
        style={{ overflowX: "visible" }}
        dragItemOverflow={true}
      />
    </>
  );
};
