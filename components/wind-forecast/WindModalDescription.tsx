import React from "react";
import { View, Text } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import ModalBoxTitle from "../modal/ModalBoxTitle";
import ModalTextBoxContainer from "../modal/ModalTextBoxContainer";
import { colors } from "@/assets/colors/colors";
import { WeatherData } from "@/constants/constants";
import Dot from "../modal/Dot";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import ModalTextBox from "../modal/ModalTextBox";
import ModalOption from "../modal/ModalOption";
import ModalTransparentTextBox from "../modal/ModalTransparentTextBox";
// import { getUVArr } from "./utils/getUVArr";
import HorizontalBar from "../uv-index/HorizontalBar";
import { getUVArr } from "../uv-index/utils/getUVArr";
import { getWindArr } from "./utils/getWindArr";
import { ListItem } from "tamagui";

interface WindModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const WindModalDescription = ({
  data,
  currentIndex,
}: WindModalDescriptionProps) => {
  const todaysWindArr = getWindArr(data, 0);
  const todaysWindHigh = Math.round(Math.max(...todaysWindArr));

  const tomorrowsWindArr = getWindArr(data, 1);
  const tomorrowsWindHigh = Math.round(Math.max(...tomorrowsWindArr));

  const maxWind = Math.max(
    Math.round(todaysWindHigh),
    Math.round(tomorrowsWindHigh)
  );

  const beaufortScaleArray = [
    {
      bftIndex: 0,
      color: "#00B2E2",
      explanation: "Calm",
      speed: "< 1",
    },
    {
      bftIndex: 1,
      color: "#00C6A7",
      explanation: "Light Air",
      speed: "1 - 2",
    },
    {
      bftIndex: 2,
      color: "#00D36F",
      explanation: "Light Breeze",
      speed: "3 - 6",
    },
    {
      bftIndex: 3,
      color: "#5DD700",
      explanation: "Gentle Breeze",
      speed: "7 - 11",
    },
    {
      bftIndex: 4,
      color: "#A8D700",
      explanation: "Moderate Breeze",
      speed: "12 - 17",
    },
    {
      bftIndex: 5,
      color: "#D1C800",
      explanation: "Fresh Breeze",
      speed: "18-23",
    },
    {
      bftIndex: 6,
      color: "#E3A100",
      explanation: "Strong Breeze",
      speed: "24 - 30",
    },
    {
      bftIndex: 7,
      color: "#E68A00",
      explanation: "Near Gale",
      speed: "31 - 38",
    },
    {
      bftIndex: 8,
      color: "#E67600",
      explanation: "Gale",
      speed: "39 - 45",
    },
    {
      bftIndex: 9,
      color: "#E66000",
      explanation: "Strong Gale",
      speed: "46 - 54",
    },
    {
      bftIndex: 10,
      color: "#E64500",
      explanation: "Storm",
      speed: "55 - 63",
    },
    {
      bftIndex: 11,
      color: "#D80019",
      explanation: "Violent Storm",
      speed: "64 - 72",
    },
    {
      bftIndex: 12,
      color: "#E40059",
      explanation: "Hurricane",
      speed: "> 73",
    },
  ];

  const dailyOverviewMessage = "Current wind speed is coming from the";
  return (
    <View className="px-4">
      <ModalTextBox title="Daily Overview">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>
      {currentIndex === 0 && (
        <>
          <DefaultText>GEOGRAPHIC DATA HERE </DefaultText>

          <ModalTextBox title="Compared to yesterday" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>
                Today's UV index is similar to yesterdays
              </DefaultText>
            </View>

            <HorizontalLine />

            <View className="gap-y-2 px-4">
              <HorizontalBar
                title="Today"
                bgColor="light"
                currentHigh={Math.round(todaysWindHigh).toString() + " mph"}
                percentage={todaysWindHigh / maxWind}
              />
              <HorizontalBar
                title="Tomorrow"
                bgColor="dark"
                currentHigh={Math.round(tomorrowsWindHigh).toString() + " mph"}
                percentage={tomorrowsWindHigh / maxWind}
              />
            </View>
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title={"Wind Information"}>
        <DefaultText>Wind is wind</DefaultText>
      </ModalTextBox>

      <ModalTextBox title={"Beaufort Wind Scale"} removeHorizontalPadding>
        <View>
          <View
            className="flex-row "
            style={{ paddingHorizontal: 16, paddingBottom: 8 }}
          >
            <View style={{ flex: 0.2 }}>
              <DefaultText className="font-semibold">bft</DefaultText>
            </View>
            <View style={{ flex: 0.6 }}>
              <DefaultText className="font-semibold">Explanation</DefaultText>
            </View>
            <View style={{ flex: 0.2 }}>
              <DefaultText className="font-semibold">mph</DefaultText>
            </View>
          </View>

          <HorizontalLine />

          {beaufortScaleArray.map((item) => (
            <>
              <View
                key={item.bftIndex}
                className="flex-row "
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 10,
                  paddingBottom:
                    item.bftIndex === beaufortScaleArray.length - 1 ? 0 : 10,
                }}
              >
                <View
                  style={{ flex: 0.2 }}
                  className="flex-row items-center gap-x-2"
                >
                  <Dot color={item.color} size={14} />
                  <DefaultText
                    className="font-semibold"
                    style={{ fontSize: 16 }}
                  >
                    {item.bftIndex}
                  </DefaultText>
                </View>
                <View style={{ flex: 0.6 }}>
                  <DefaultText
                    className="font-semibold"
                    style={{ color: colors.lightGray, fontSize: 16 }}
                  >
                    {item.explanation}
                  </DefaultText>
                </View>
                <View style={{ flex: 0.2 }}>
                  <DefaultText
                    className="font-semibold"
                    style={{ color: colors.lightGray, fontSize: 16 }}
                  >
                    {item.speed}
                  </DefaultText>
                </View>
              </View>

              {item.bftIndex !== beaufortScaleArray.length - 1 && (
                <HorizontalLine />
              )}
            </>
          ))}
        </View>
      </ModalTextBox>

      <ModalTextBox title={"About Beaufort Wind Scale"}>
        <DefaultText
          className=""
          style={{ lineHeight: 18, letterSpacing: 0.2 }}
        >
          The Beaufort scale is a wind force scale that uses numbers to describe
          wind speed and conditions. It was developed by Sir Francis Beaufort of
          the U.K. Royal Navy in 1805.
        </DefaultText>
      </ModalTextBox>

      <ModalOption title="Option" />
    </View>
  );
};

export default WindModalDescription;
