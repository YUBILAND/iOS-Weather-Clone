// import { colors } from "@/assets/colors/colors";
// import { weatherKey } from "@/constants/constants";
// import { RootState } from "@/state/store";
// import { weatherPNG } from "@/utils/exampleForecast";
// import React, {
//   memo,
//   MutableRefObject,
//   RefObject,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import {
//   FlatList,
//   Image,
//   useWindowDimensions,
//   View,
//   Animated as RNAnimated,
//   ViewToken,
// } from "react-native";
// import Animated, { useAnimatedProps } from "react-native-reanimated";
// import { shallowEqual, useSelector } from "react-redux";
// import { useChartPressState } from "victory-native";
// import DefaultText from "../atoms/DefaultText";
// import HorizontalLine from "../atoms/HorizontalLine";
// import PrecipitationGraph from "../graphs/PrecipitationGraph";
// import TemperatureGraph from "../graphs/TemperatureGraph";
// import CalendarScrollView from "../modal/CalendarScrollView";
// import GraphContainer from "../modal/GraphContainer";
// import ModalBoxTitle from "../modal/ModalBoxTitle";
// import ModalTextBoxContainer from "../modal/ModalTextBoxContainer";
// import { getCalendarDate } from "@/hooks/hooks";
// import ModalDropdown from "../modal/ModalDropdownContainer";
// import Test from "@/app/Test";
// import { SelectDemo, SelectDemoItem } from "../atoms/Dropdown";
// import ModalDropdownContainer from "../modal/ModalDropdownContainer";
// import TitleTemp from "../hourly-forecast/TitleTemp";
// import UVGraph from "../graphs/UVGraph";

// Animated.addWhitelistedNativeProps({ value: true, source: true });

// type UVModalProps = {
//   cityName: string;
//   currentIndex: number;
//   setCurrentIndex: (index: number) => void;
//   currentIndexRef: MutableRefObject<number>;
//   selectedModal: number;
//   setSelectedModal: (index: number) => void;
// };

// const UVModal = ({
//   cityName,
//   currentIndex,
//   setCurrentIndex,
//   currentIndexRef,
//   selectedModal,
//   setSelectedModal,
// }: UVModalProps) => {
//   // Chart Press State for temperature
//   const { state: tempState, isActive: tempIsActive } = useChartPressState({
//     x: 0,
//     y: {
//       celsius: 0,
//       currentLineTop: 0,
//       currentLineBottom: 0,
//       currentPosition: 0,
//     },
//   });

//   // Rerender to prevent bug aniamtion when scrolling on mount
//   const [update, setUpdate] = useState(false);
//   useEffect(() => {
//     setTimeout(() => {
//       setUpdate(!update);
//     });
//   }, []);

//   const tempScrollInfoBold = useAnimatedProps(() => {
//     const celsius = `${Math.round(tempState.y.celsius.value.value)}°`;
//     return {
//       text: celsius,
//       value: celsius,
//     };
//   });

//   const { data } = useSelector((state: RootState) => state.weather);
//   const { location, forecast, current } = data[cityName];

//   const flatlistRef = useRef<FlatList>(null);

//   const graphData: { id: number }[] = useMemo(() => {
//     return Array(3)
//       .fill(0)
//       .map((_, idx) => ({ id: idx }));
//   }, []);

//   const { width } = useWindowDimensions();
//   // const scrollX = React.useRef(new RNAnimated.Value(0)).current;

//   const flatlistProps = {
//     horizontal: true,
//     decelerationRate: 0,
//     snapToInterval: width, // Use the screen width
//     snapToAlignment: "center" as const,
//     showsHorizontalScrollIndicator: false,
//     pagingEnabled: true,
//     // onScroll: RNAnimated.event(
//     //   [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//     //   { useNativeDriver: false }
//     // ),
//   };

//   const currentlyScrollingRef = useRef<boolean>(true);

//   // If user is scrolling, animate the scroll
//   if (flatlistRef.current && currentlyScrollingRef.current) {
//     console.log("currentIndex is ", currentIndex);
//     flatlistRef.current.scrollToIndex({ animated: true, index: currentIndex });
//   }

//   const handleViewableItemsChanged = useCallback(
//     ({
//       viewableItems,
//     }: {
//       viewableItems: ViewToken<{
//         id: number;
//       }>[];
//     }) => {
//       if (!currentlyScrollingRef.current) {
//         // console.log("Visible items are", viewableItems[0].index);
//         setCurrentIndex(viewableItems[0]?.index ?? 0); // Update state
//       }
//       currentlyScrollingRef.current = false;
//     },
//     []
//   ); // Empty dependency array means this function is memoized

//   const renderItem = ({ item }: { item: { id: number } }) => {
//     return (
//       <View className="w-screen">
//         {/* Temperature graph */}
//         <GraphContainer
//           cityName={cityName}
//           state={tempState}
//           isActive={tempIsActive}
//           hackyWeatherImage
//           scrollInfoBold={tempScrollInfoBold}
//           currentIndex={item.id}
//           leftSide={<TitleTemp data={data[cityName]} item={item} />}
//         >
//           <UVGraph
//             cityName={cityName}
//             state={tempState}
//             isActive={tempIsActive}
//             graphHeight={200}
//             strokeWidth={4}
//             yAxisLabel="°"
//             currentIndex={item.id}
//           />
//         </GraphContainer>

//         {/* Precipitation graph */}

//         <ModalDropdownContainer
//           isActive={tempIsActive}
//           selectedModal={selectedModal}
//           setSelectedModal={setSelectedModal}
//         />
//       </View>
//     );
//   };

//   const keyExtractor = useCallback(
//     (_: { id: number }, index: number) => index.toString(),
//     []
//   );

//   return (
//     <>
//       {/* Calendar */}
//       <View>
//         <CalendarScrollView
//           cityName={cityName}
//           currentIndex={currentIndex}
//           setCurrentIndex={setCurrentIndex}
//           currentIndexRef={currentIndexRef}
//           scrollRef={currentlyScrollingRef}
//         />

//         <HorizontalLine />
//       </View>

//       {/* Graphs */}
//       <>
//         <FlatList
//           onViewableItemsChanged={handleViewableItemsChanged}
//           viewabilityConfig={{
//             itemVisiblePercentThreshold: 50,
//           }}
//           {...flatlistProps}
//           ref={flatlistRef}
//           data={graphData}
//           keyExtractor={keyExtractor}
//           renderItem={renderItem}
//         />
//       </>

//       {/* <View className="px-4">
//         <View>
//           <ModalBoxTitle title="Total Rainfall" />

//           <ModalTextBoxContainer>
//             <View className="gap-y-2">
//               <DefaultText>Last 24 hours</DefaultText>
//               <View className="flex-row justify-between">
//                 <DefaultText>Precipitation</DefaultText>
//                 <DefaultText>0"</DefaultText>
//               </View>
//             </View>

//             <HorizontalLine />

//             <View className="gap-y-2">
//               <DefaultText>Last 24 hours</DefaultText>
//               <View className="flex-row justify-between">
//                 <DefaultText>Precipitation</DefaultText>
//                 <DefaultText>0"</DefaultText>
//               </View>
//             </View>
//           </ModalTextBoxContainer>
//         </View>

//         <View>
//           <ModalBoxTitle title="Forecast" />

//           <ModalTextBoxContainer>
//             <View className="text-balance ">
//               <DefaultText className="font-semibold">
//                 Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis,
//                 illo harum cupiditate accusantium et voluptate nemo earum
//                 placeat! Necessitatibus quibusdam saepe voluptate libero
//                 doloremque quo dolores deleniti ab quam molestiae!
//               </DefaultText>
//             </View>
//           </ModalTextBoxContainer>
//         </View>

//         <View>
//           <ModalBoxTitle title="Compared to yesterday" />

//           <ModalTextBoxContainer removeHorizontalPadding>
//             <View className="gap-y-2 px-4">
//               <DefaultText>Today is hotter than yesterday</DefaultText>
//             </View>

//             <HorizontalLine />

//             <View className="gap-y-2 px-4">
//               <View className="flex-row ">
//                 <DefaultText className="flex-[0.2]">Today</DefaultText>
//                 <DefaultText className="flex-[0.8]">
//                   <View className="items-center w-full">
//                     <DefaultText>Progress Bar</DefaultText>
//                   </View>
//                 </DefaultText>
//               </View>

//               <View className="flex-row justify-between">
//                 <DefaultText className="flex-[0.2]">Yesterday</DefaultText>
//                 <DefaultText className="flex-[0.8]">
//                   <View className="items-center w-full">
//                     <DefaultText>Progress Bar</DefaultText>
//                   </View>
//                 </DefaultText>
//               </View>
//             </View>
//           </ModalTextBoxContainer>
//         </View>

//         <View>
//           <ModalBoxTitle title="Option" />

//           <ModalTextBoxContainer>
//             <View className="flex-row justify-between">
//               <DefaultText>Metric</DefaultText>
//               <DefaultText>Use system settings C°</DefaultText>
//             </View>
//           </ModalTextBoxContainer>
//         </View>
//       </View> */}
//     </>
//   );
// };

// export default UVModal;
