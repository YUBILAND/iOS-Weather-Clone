import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import LocationCardItemContainer from "./LocationCardItemContainer";
import LocationCardItem from "./LocationCardItem";
import { FlatList } from "react-native";

export type Item = {
  index: number;
  label: string;
  height: number;
  width: number;
  backgroundColor: string;
};

function getColor(i: number) {
  const multiplier = 255 / (7 - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

interface LocationCardFlatlistProps {
  weatherScreens: string[];
  closeSetting: () => void;
  goToWeatherScreen: (screen: number) => void;
  topOffset?: number;
  activeScale: number;
  stickyElement: React.ComponentType;
  handleScroll: (event: any) => void;
  flatlistRef: React.RefObject<FlatList<Item>>;
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
}: LocationCardFlatlistProps) => {
  const initialData: Item[] = useMemo(
    () =>
      [...Array(weatherScreens.length)].map((d, index) => {
        const backgroundColor = getColor(index);
        return {
          index: index,
          label: String(index) + "",
          height: 100,
          width: 60 + Math.random() * 40,
          backgroundColor,
        };
      }),
    [weatherScreens]
  );

  const [data, setData] = useState(initialData);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Item>) => {
      return (
        <>
          {/* ScaleDecorator allows enlarge on hover */}
          <ScaleDecorator activeScale={activeScale}>
            <TouchableOpacity
              //   onLongPress={drag}
              disabled={isActive}
              style={{ opacity: isActive ? 0.8 : 1 }}
              //   style={[
              //     styles.rowItem,
              //     { backgroundColor: isActive ? "red" : item.backgroundColor },
              //   ]}
            >
              <LocationCardItemContainer
                closeSetting={closeSetting}
                weatherScreens={weatherScreens}
                idx={item.index}
                goToWeatherScreen={goToWeatherScreen}
                drag={drag}
              >
                <LocationCardItem city={weatherScreens[item.index]} />
              </LocationCardItemContainer>
            </TouchableOpacity>
          </ScaleDecorator>
        </>
      );
    },
    [weatherScreens]
  );

  //   const StickyElement = React.memo(stickyElement);

  return (
    <>
      {/* <StickyElement /> */}

      <DraggableFlatList
        // @ts-ignore
        ref={flatlistRef}
        contentContainerStyle={{
          paddingTop: topOffset,
          rowGap: 8,
        }}
        style={{ overflow: "visible", height: "95%" }}
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.index.toString()}
        renderItem={renderItem}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={stickyElement}
        showsVerticalScrollIndicator={false}
        onScrollOffsetChange={(e) => handleScroll(e)}
        keyboardShouldPersistTaps="handled"
      />
    </>
  );
};
