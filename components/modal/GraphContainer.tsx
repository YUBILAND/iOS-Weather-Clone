import {
  View,
  Text,
  TextInput,
  Image,
  ImageSourcePropType,
  TextInputProps,
} from "react-native";
import React, { ReactNode } from "react";
import { colors } from "@/assets/colors/colors";
import { ChartPressState } from "victory-native";
import Animated, {
  AnimatedProps,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { weatherPNG } from "@/utils/exampleForecast";
import { weatherKey, WeatherType } from "@/constants/constants";
import DefaultText from "../atoms/DefaultText";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface YAxisValue {
  value: SharedValue<number>;
  position: SharedValue<number>;
}

interface YAxisState<Key extends string> {
  [key: string]: YAxisValue; // Dynamic keys with YAxisValue type
  currentLineTop: YAxisValue;
  currentLineBottom: YAxisValue;
  currentPosition: YAxisValue;
}

interface ChartPressedState<Key extends string> {
  x: {
    value: SharedValue<number>;
    position: SharedValue<number>;
  };
  y: YAxisState<Key>;
}

interface GraphContainerProps<Key extends string> {
  cityName: string;
  state: ChartPressedState<Key>;
  isActive: boolean;
  leftSide: React.ReactNode;
  children: React.ReactNode;
  hackyWeatherImage?: boolean;
  scrollInfoBold: Partial<AnimatedProps<TextInputProps>>;
  smallBold?: boolean;
}

const GraphContainer = <Key extends string>({
  cityName,
  state,
  isActive,
  leftSide,
  children,
  hackyWeatherImage = false,
  scrollInfoBold,
  smallBold = false,
}: GraphContainerProps<Key>) => {
  const { data } = useSelector((state: RootState) => state.weather);
  const { forecast } = data[cityName];

  // To discrern which y axis key was passed
  const yAxisKey = Object.keys(state.y).find(
    (key) =>
      key !== "currentLineTop" &&
      key !== "currentLineBottom" &&
      key !== "currentPosition"
  ) as Key;

  console.log(yAxisKey);

  // Dynamically show time
  const animatedTime = useAnimatedProps(() => {
    const time = `${state.x.value.value % 24}:00`;
    return {
      text: time,
      value: time,
    };
  });

  const stopLeftScrollOnXValue = 4;

  //Translate X so time follows user drag
  const animatedStyle = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;
    return {
      transform: [
        { translateX: xValue < stopLeftScrollOnXValue ? 30 : xPosition - 10 },
      ], // Translate X based on state.x
    };
  });

  // Translate X so bold text follows user drag, same as above but for bigger text
  const animatedView = useAnimatedStyle(() => {
    const xPosition = state.x.position.value;
    const xValue = state.x.value.value;

    return {
      transform: [
        {
          translateX:
            xValue < stopLeftScrollOnXValue
              ? hackyWeatherImage
                ? 10
                : 30
              : hackyWeatherImage
              ? xPosition - 10 - 20
              : xPosition - 10,
        },
      ],
    };
  });

  // Add midnight value
  const todaysForecast = forecast?.forecastday[0]?.hour;
  const addMidnightWeather = [
    ...todaysForecast,
    {
      condition: {
        text: todaysForecast[todaysForecast.length - 1].condition.text,
      },
      is_day: todaysForecast[todaysForecast.length - 1].is_day,
    },
  ];

  // Used in case of hacky dynamic image solution
  const conditionArray =
    forecast &&
    addMidnightWeather.map((hour) => {
      return weatherKey[weatherPNG(hour.condition.text, hour.is_day)];
    });

  return (
    <View className="pt-2">
      <View className="mb-2 ">
        {/* Draggable Time */}
        <View
          style={{
            opacity: isActive ? 100 : 0,
            position: "absolute",
          }}
        >
          {/* Shows user hovered time */}
          <AnimatedTextInput
            editable={false}
            underlineColorAndroid={"transparent"}
            style={[
              {
                fontSize: 14,
                width: 1,
                color: colors.lightGray,
              },
              animatedStyle,
            ]}
            animatedProps={animatedTime}
          />

          {/* Shows user hovered weather image and temperature */}
          <AnimatedView
            style={[animatedView]}
            className="flex-row items-center "
          >
            {hackyWeatherImage && (
              <>
                {/* Overlay all images in same spot but toggle opacity based on user dragged line */}
                {conditionArray.map((val, index) => (
                  <AnimatedImage
                    key={index}
                    className={"absolute top-0 left-0 "}
                    style={[
                      ,
                      { width: 35, height: 35 },
                      useAnimatedStyle(() => ({
                        opacity: state.x.value.value === index ? 100 : 0,
                      })),
                    ]}
                    animatedProps={useAnimatedProps(() => ({
                      source: val as ImageSourcePropType,
                    }))}
                  />
                ))}
              </>
            )}
            <AnimatedTextInput
              editable={false}
              underlineColorAndroid={"transparent"}
              style={[
                {
                  fontSize: smallBold ? 20 : 30,
                  color: "white",
                  width: 10, // removes ellipses
                  marginLeft: hackyWeatherImage ? 40 : 0,
                  fontWeight: 800,
                },
              ]}
              animatedProps={scrollInfoBold}
            />
          </AnimatedView>
        </View>

        {/* Left side  */}
        <View
          style={{
            paddingLeft: 8,
            gap: 2,
            opacity: isActive ? 0 : 100,
          }}
        >
          {leftSide}
        </View>
      </View>

      <View
        className="pr-4"
        style={{
          borderWidth: 1,
          borderColor: colors.mediumGray,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default GraphContainer;
