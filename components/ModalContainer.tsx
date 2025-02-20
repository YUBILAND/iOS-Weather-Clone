import {
  View,
  Text,
  Image,
  Modal,
  SafeAreaView,
  TextInput,
} from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import ModalHeader from "./ModalHeader";
import DefaultText from "./DefaultText";
import { days, weatherPNG } from "@/utils/exampleForecast";
import CalendarScrollView from "./CalendarScrollView";
import Chart from "./Chart";
import { useChartPressState } from "victory-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import SpaceMono from "../assets/fonts/SpaceMono-Regular.ttf";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { WeatherType } from "@/constants/constants";
import { SelectModal } from "./WeatherAtLocation";
import { FontAwesome } from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

Animated.addWhitelistedNativeProps({ value: true, source: true });

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedImage = Animated.createAnimatedComponent(Image);

type IconName =
  | "sun-o"
  | "moon-o"
  | "cloud"
  | "coffee"
  | "user"
  | "home"
  | "search";
type ConditionModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<SelectModal | null>>;
  cityName: string;
  children: React.ReactNode;
  title: string;
  iconName: IconName;
};

const ModalContainer = ({
  modalVisible,
  setModalVisible,
  cityName,
  children,
  title,
  iconName,
}: ConditionModalProps) => {
  const { state, isActive } = useChartPressState({ x: 0, y: { celsius: 0 } });

  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const { location, forecast, current } = data[cityName];

  const animatedCelsius = useAnimatedProps(() => {
    const celsius = `${Math.round(state.y.celsius.value.value)}°`;
    return {
      text: celsius,
      value: celsius,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: state.x.position.value - 14 }], // Translate X based on state.x
    };
  });

  const animatedView = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: state.x.position.value - 14 - 20 }],
    };
  });

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <SafeAreaView className="">
        <View
          className=" h-screen"
          style={{ backgroundColor: colors.darkGray }}
        >
          <View className="flex-row items-center justify-between px-6 pt-4 ">
            <ModalHeader closeModal={() => setModalVisible(null)} title={title}>
              <FontAwesome name={iconName} color="white" size={22} />
            </ModalHeader>
          </View>

          {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ModalContainer;
