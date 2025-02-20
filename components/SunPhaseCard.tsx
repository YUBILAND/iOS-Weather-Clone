import {
  View,
  Text,
  Image,
  Modal,
  SafeAreaView,
  TextInput,
  Pressable,
} from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import CalendarScrollView from "./CalendarScrollView";
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
import SunPhaseTest, { regularTimeOnXAxis } from "./SunPhaseGraph";
import SunPhaseGraph from "./SunPhaseGraph";
import OpacityCard from "./OpacityCard";
import { CalendarDaysIcon } from "react-native-heroicons/outline";
import DefaultText from "./DefaultText";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { getCurrentHour, getCurrentTime, militaryHour } from "@/hooks/hooks";
import ModalContainer from "./ModalContainer";
import SunPhaseModal from "./SunPhaseModal";
import { SelectModal } from "./WeatherAtLocation";

Animated.addWhitelistedNativeProps({ value: true, source: true });

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type SunPhaseModalProps = {
  cityName: string;
  graphHeight: number;
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<SelectModal | null>>;
  modalID: SelectModal;
};

const SunPhaseCard = ({
  cityName,
  graphHeight,
  modalVisible,
  setModalVisible,
  modalID,
}: SunPhaseModalProps) => {
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { sunPath: 0, sunPosition: 0, phaseLine: 0 },
  });

  const { data } = useSelector((state: RootState) => state.weather);
  const { forecast, current, location } = data[cityName];

  const animatedHour = useAnimatedProps(() => {
    const hourConversion = Math.floor((state.x.value.value * 60) / 60);
    const minuteConversion: number =
      (Math.round(state.x.value.value * 60 * 100) / 100) % 60;
    const hours =
      hourConversion.toString() +
      ":" +
      (minuteConversion < 10
        ? "0" + minuteConversion.toString()
        : minuteConversion.toString());

    const hour = hours;
    return {
      text: hour,
      value: hour,
    };
  });

  const animatedRange = useAnimatedProps(() => {
    const range = `${state.y.sunPath.value.value}`;
    return {
      text: range,
      value: range,
    };
  });

  const currentTime = getCurrentTime(location?.tz_id);
  console.log(
    "It is currently",
    currentTime,
    "in",
    location?.tz_id.split("/")[1]
  );

  const currentSunriseTime = forecast.forecastday[0].astro.sunrise.replace(
    /^0/,
    ""
  );
  // console.log("Sunrise at", currentSunriseTime);

  const currentSunsetTime = forecast.forecastday[0].astro.sunset.replace(
    /^0/,
    ""
  );
  // console.log("Sunset at", currentSunsetTime);

  const nextSunriseTime = forecast.forecastday[1].astro.sunrise.replace(
    /^0/,
    ""
  );
  // console.log("Sunset at", currentSunsetTime);

  // console.log("Current military hour is", militaryHour(currentTime));
  // console.log("Sunrise military hour is", militaryHour(currentSunriseTime));
  // console.log("Sunset military hour is", militaryHour(currentSunsetTime));

  const normalizedCurrentTime = regularTimeOnXAxis(currentTime);
  const normalizedSunrise = regularTimeOnXAxis(currentSunriseTime);
  const normalizedSunset = regularTimeOnXAxis(currentSunsetTime);

  let nextPhaseTime = "";

  if (normalizedCurrentTime < normalizedSunrise) {
    // show sunrise Time
    nextPhaseTime = currentSunriseTime;
  } else if (
    normalizedCurrentTime >= normalizedSunrise &&
    normalizedCurrentTime < normalizedSunset
  ) {
    // show sunrise time
    nextPhaseTime = currentSunsetTime;
  } else {
    //show tomorrows sunrise time
    nextPhaseTime = nextSunriseTime;
  }

  const hourDifference =
    militaryHour(nextPhaseTime) - militaryHour(currentTime);
  const minuteDifference =
    parseInt(nextPhaseTime.split(":")[1].split(" ")[0]) -
    parseInt(currentTime.split(":")[1].split(" ")[0]);

  let remainingHours = hourDifference;
  let remainingMinutes = 0;

  if (minuteDifference < 0) {
    remainingHours -= 1;
    remainingMinutes += 60 + minuteDifference;
  } else {
    remainingMinutes += minuteDifference;
  }

  console.log(remainingMinutes);

  const remainingTime =
    remainingHours.toString() +
    ":" +
    (remainingMinutes < 10
      ? "0" + remainingMinutes.toString()
      : remainingMinutes.toString());

  return (
    <OpacityCard className="">
      <Pressable onPress={() => setModalVisible(modalID)}>
        <ModalContainer
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          cityName={cityName}
          title={"Sun Phase"}
          iconName="sun-o"
        >
          <SunPhaseModal cityName={cityName} nextPhaseTime={nextPhaseTime} />
        </ModalContainer>

        <View className="px-4 gap-y-3">
          <View className="flex-row items-center gap-x-2 opacity-40">
            <FontAwesome name="sun-o" color="white" size={22} />
            <DefaultText className="text-base uppercase font-semibold">
              Sun Phase
            </DefaultText>
          </View>
          <DefaultText className="text-3xl uppercase font-semibold">
            {nextPhaseTime}
          </DefaultText>
        </View>

        <SunPhaseGraph
          cityName={cityName}
          state={state}
          isActive={isActive}
          graphHeight={graphHeight}
          strokeWidth={4}
          removePress
        />
        <DefaultText className="px-4 text-base">{`in ${
          remainingTime.split(":")[0]
        } hrs ${remainingTime.split(":")[1]} mins`}</DefaultText>
      </Pressable>
    </OpacityCard>
  );
};

export default SunPhaseCard;
