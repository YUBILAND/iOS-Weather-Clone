import {
  View,
  Text,
  Image,
  Modal,
  SafeAreaView,
  TextInput,
  ImageSourcePropType,
  ImageBackground,
  ScrollView,
} from "react-native";
import React from "react";
import { colors } from "@/assets/colors/colors";
import ModalHeader from "../modal/ModalHeader";
import DefaultText from "../atoms/DefaultText";
import { days, weatherPNG } from "@/utils/exampleForecast";
import CalendarScrollView from "../modal/CalendarScrollView";
import { useChartPressState } from "victory-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import SpaceMono from "../../assets/fonts/SpaceMono-Regular.ttf";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { weatherImages, weatherKey, WeatherType } from "@/constants/constants";
import TemperatureGraph from "../graphs/TemperatureGraph";
import HorizontalLine from "../atoms/HorizontalLine";
import GraphContainer from "../modal/GraphContainer";
import PrecipitationGraph from "../graphs/PrecipitationGraph";
import ModalTextBoxContainer from "../modal/ModalTextBoxContainer";
import ModalBoxTitle from "../modal/ModalBoxTitle";

Animated.addWhitelistedNativeProps({ value: true, source: true });

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

type ConditionModalProps = {
  cityName: string;
};

const HourlyModal = ({ cityName }: ConditionModalProps) => {
  // Chart Press State for temperature
  const { state: tempState, isActive: tempIsActive } = useChartPressState({
    x: 0,
    y: {
      celsius: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });

  // Chart Press State for precipitation
  const { state: rainState, isActive: rainIsActive } = useChartPressState({
    x: 0,
    y: {
      chanceOfRain: 0,
      currentLineTop: 0,
      currentLineBottom: 0,
      currentPosition: 0,
    },
  });

  const { data } = useSelector((state: RootState) => state.weather);

  const { forecast, current } = data[cityName];

  const hourlyTempMap = forecast?.forecastday[0].hour.map((hour) =>
    Math.round(parseFloat(hour.temp_c))
  );
  const maxCelsius = Math.max(...hourlyTempMap);
  const minCelsius = Math.min(...hourlyTempMap);

  const currentTemperature = Math.round(parseFloat(current?.temp_c));

  const tempScrollInfoBold = useAnimatedProps(() => {
    const celsius = `${Math.round(tempState.y.celsius.value.value)}°`;
    return {
      text: celsius,
      value: celsius,
    };
  });

  const rainScrollInfoBold = useAnimatedProps(() => {
    const chanceOfRain = `${Math.round(rainState.y.chanceOfRain.value.value)}%`;
    return {
      text: chanceOfRain,
      value: chanceOfRain,
    };
  });

  return (
    <>
      {/* Calendar */}
      <View>
        <CalendarScrollView cityName={cityName} />

        <HorizontalLine />
      </View>

      <View className="mx-4 ">
        {/* Graphs */}
        <>
          {/* Temperature graph */}
          <GraphContainer
            cityName={cityName}
            state={tempState}
            isActive={tempIsActive}
            hackyWeatherImage
            scrollInfoBold={tempScrollInfoBold}
            leftSide={
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    gap: 8,
                  }}
                >
                  <DefaultText className="text-4xl">
                    {currentTemperature}&#176;
                  </DefaultText>
                  <Image
                    source={
                      weatherKey[
                        weatherPNG(current?.condition.text, current?.is_day)
                      ]
                    }
                    style={{ width: 40, height: 40 }}
                  />
                </View>
                <View>
                  <DefaultText style={{ color: colors.lightGray }}>
                    H: {maxCelsius}&#176; L: {minCelsius}&#176;
                  </DefaultText>
                </View>
              </>
            }
          >
            <TemperatureGraph
              cityName={cityName}
              state={tempState}
              isActive={tempIsActive}
              graphHeight={200}
              strokeWidth={4}
              yAxisLabel="°"
            />
          </GraphContainer>

          {/* Precipitation graph */}
          <GraphContainer
            cityName={cityName}
            state={rainState}
            isActive={rainIsActive}
            scrollInfoBold={rainScrollInfoBold}
            smallBold
            leftSide={
              <View className="h-12" style={{ justifyContent: "center" }}>
                <DefaultText className="text-2xl font-semibold ">
                  Rain Probability
                </DefaultText>
              </View>
            }
          >
            <PrecipitationGraph
              cityName={cityName}
              state={rainState}
              isActive={rainIsActive}
              graphHeight={200}
              strokeWidth={4}
              yAxisLabel="%"
            />
          </GraphContainer>
        </>

        <View>
          <ModalBoxTitle title="Total Rainfall" />

          <ModalTextBoxContainer>
            <View className="gap-y-2">
              <DefaultText>Last 24 hours</DefaultText>
              <View className="flex-row justify-between">
                <DefaultText>Precipitation</DefaultText>
                <DefaultText>0"</DefaultText>
              </View>
            </View>

            <HorizontalLine />

            <View className="gap-y-2">
              <DefaultText>Last 24 hours</DefaultText>
              <View className="flex-row justify-between">
                <DefaultText>Precipitation</DefaultText>
                <DefaultText>0"</DefaultText>
              </View>
            </View>
          </ModalTextBoxContainer>
        </View>

        <View>
          <ModalBoxTitle title="Forecast" />

          <ModalTextBoxContainer>
            <View className="text-balance ">
              <DefaultText className="font-semibold">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnis,
                illo harum cupiditate accusantium et voluptate nemo earum
                placeat! Necessitatibus quibusdam saepe voluptate libero
                doloremque quo dolores deleniti ab quam molestiae!
              </DefaultText>
            </View>
          </ModalTextBoxContainer>
        </View>

        <View>
          <ModalBoxTitle title="Compared to yesterday" />

          <ModalTextBoxContainer removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>Today is hotter than yesterday</DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <View className="flex-row ">
                <DefaultText className="flex-[0.2]">Today</DefaultText>
                <DefaultText className="flex-[0.8]">
                  <View className="items-center w-full">
                    <DefaultText>Progress Bar</DefaultText>
                  </View>
                </DefaultText>
              </View>

              <View className="flex-row justify-between">
                <DefaultText className="flex-[0.2]">Yesterday</DefaultText>
                <DefaultText className="flex-[0.8]">
                  <View className="items-center w-full">
                    <DefaultText>Progress Bar</DefaultText>
                  </View>
                </DefaultText>
              </View>
            </View>
          </ModalTextBoxContainer>
        </View>

        <View>
          <ModalBoxTitle title="Option" />

          <ModalTextBoxContainer>
            <View className="flex-row justify-between">
              <DefaultText>Metric</DefaultText>
              <DefaultText>Use sytstem settings C°</DefaultText>
            </View>
          </ModalTextBoxContainer>
        </View>
      </View>
    </>
  );
};

export default HourlyModal;
