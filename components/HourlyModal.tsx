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

Animated.addWhitelistedNativeProps({ value: true, source: true });

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedImage = Animated.createAnimatedComponent(Image);

type ConditionModalProps = {
  cityName: string;
};

const HourlyModal = ({ cityName }: ConditionModalProps) => {
  const { state, isActive } = useChartPressState({ x: 0, y: { celsius: 0 } });

  const { data, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const { location, forecast, current } = data[cityName];

  const font = useFont(SpaceMono, 16);

  const text = "HELLO THERE";
  const textMetrics = font?.measureText(text);
  const textWidth = textMetrics?.width;

  const chartMargin = 8;

  const textX = useDerivedValue(
    () => state.x.position.value - (textWidth ? textWidth / 2 : 0) + chartMargin
  );

  //margin 8 pushes UpText to the left 8px , padding doesn't

  const image = require("../assets/images/cloudy.png");

  const animatedTime = useAnimatedProps(() => {
    const time = `${state.x.value.value}:00`;
    return {
      text: time,
      value: time,
    };
  });

  const mapping =
    forecast &&
    forecast?.forecastday[0]?.hour.map((hour) => {
      return weatherPNG(
        (hour.condition.text.toLowerCase() as WeatherType) ?? "Sunny"
      );
    });

  // console.log(mapping);

  const imageMap = require("../assets/images/cloudy.png");

  const animatedImage = useAnimatedProps(() => {
    // const image = `${state.x.value.value}:00`;
    const stateHour = state.x.value.value;
    // Safely access forecast data, with fallback
    const forecastHour = forecast?.forecastday[0]?.hour[stateHour];

    const image = imageMap;

    // const image =
    //   forecastHour && forecastHour.condition && forecastHour.condition.text
    //     ? weatherPNG(
    //         (forecastHour.condition.text.toLowerCase() as WeatherType) ??
    //           "Sunny"
    //       )
    //     : weatherPNG("Sunny" as WeatherType); // Fallback to "Sunny" if condition.text is missing or invalid

    return {
      source: image,

      // source: { uri: 'https://example.com/image.jpg' }, // Dynamic image source
      // style: { transform: [{ translateX: state.x.value.value }] }, // Example transform animation
    };
  });

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
    <>
      <View>
        <CalendarScrollView cityName={cityName} />

        <Text // Horizontal line
          style={{ borderTopWidth: 1, borderTopColor: colors.bgWhite(0.2) }}
        />
      </View>

      <View style={{ height: 60 }}>
        <View
          style={{
            opacity: isActive ? 100 : 0,
            position: isActive ? undefined : "absolute",
          }}
        >
          <View>
            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={"transparent"}
              style={[
                {
                  fontSize: 18,
                  color: colors.lightGray,
                },
                animatedStyle,
              ]}
              animatedProps={animatedTime}
            />
          </View>

          <AnimatedView style={[animatedView]} className="flex-row gap-x-2">
            <AnimatedImage
              style={[, { width: 40, height: 40 }]}
              animatedProps={animatedImage}
            />
            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={"transparent"}
              style={[
                {
                  fontSize: 24,
                  color: "white",
                },
                ,
              ]}
              animatedProps={animatedCelsius}
            />
          </AnimatedView>
        </View>
        {!isActive && (
          // <CartesianChart data={DATA} xKey="day" yKeys={["highTmp"]}>
          //   {({ points }) => (
          //     //👇 pass a PointsArray to the Line component, as well as options.
          //     <>
          //       <SkiaText
          //         x={textX}
          //         y={40} // Slightly above the circle for positioning
          //         font={font}
          //         color="white"
          //         text={animatedText.value?.toString() ?? "What"}
          //       />
          //       <SkiaText
          //         x={textX}
          //         y={20} // Slightly above the circle for positioning
          //         font={font}
          //         color="white"
          //         text={text}
          //       />
          //     </>
          //   )}
          // </CartesianChart>
          <View
            style={{
              marginHorizontal: 8,
              paddingLeft: 8,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <DefaultText className="text-4xl">1&#176;</DefaultText>
              <Image source={image} style={{ width: 40, height: 40 }} />
            </View>

            <View>
              <DefaultText style={{ color: colors.lightGray }}>
                High: 5&#176; Low: 1&#176;
              </DefaultText>
            </View>
          </View>
        )}
      </View>

      <View
        className=" pr-6 "
        style={{
          borderWidth: 1,
          borderColor: colors.mediumGray,
          borderRadius: 20,
          marginHorizontal: chartMargin,
        }}
      >
        <Chart cityName={cityName} state={state} isActive={isActive} />
      </View>
    </>
  );
};

export default HourlyModal;
