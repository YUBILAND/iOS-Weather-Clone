import { WeatherData } from "@/constants/constants";
import React from "react";
import { View } from "react-native";
import DefaultText from "../atoms/DefaultText";
import HorizontalLine from "../atoms/HorizontalLine";
import ModalTextBox from "../modal/ModalTextBox";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { OtherUnitsType } from "@/state/settings/constants";
import { useChangeOtherUnits } from "../location-modal/unit-modal/hooks/useChangeOtherUnits";
import SettingsTextBoxContainer from "../location-modal/unit-modal/SettingsTextBoxContainer";
import SettingsTextBoxList from "../location-modal/unit-modal/SettingsTextBoxList";
import { windOptionUnitArr } from "../location-modal/unit-modal/utils/constants";
import { getDayArr } from "../precipitation/utils/getDayArr";
import BeaufortScale from "./BeaufortScale";
import { getMinMaxArr } from "../utils/getMinMaxArr";
import BarComparison from "../modal/BarComparison";

interface WindModalDescriptionProps {
  data: WeatherData;
  currentIndex: number;
}

const WindModalDescription = ({
  data,
  currentIndex,
}: WindModalDescriptionProps) => {
  const windUnit = useOtherUnits()["wind"];

  const changeOtherUnits = useChangeOtherUnits();
  const selectOtherUnits = (otherUnit: {
    [key in keyof OtherUnitsType]: string;
  }) => {
    changeOtherUnits(otherUnit);
  };

  const { arrMax: todaysGustHigh } = getMinMaxArr(
    getDayArr(data, 0, "gust_mph")
  );
  const { arrMax: tomorrowsGustHigh } = getMinMaxArr(
    getDayArr(data, 1, "gust_mph")
  );

  const dailyOverviewMessage = "Current wind speed is coming from the";
  const dailyComparisonText = `Today's Wind is similar to Tomorrows`;
  const windDefinition = `Wind Speed`;
  const bftDefinition = `The Beaufort scale is a wind force scale that uses numbers to describe wind speed and conditions. It was developed by Sir Francis Beaufort of the U.K. Royal Navy in 1805.`;

  const firstIndex = currentIndex === 0;

  return (
    <View className="px-4">
      <ModalTextBox title="Daily Summary">
        <DefaultText>{dailyOverviewMessage}</DefaultText>
      </ModalTextBox>
      {firstIndex && (
        <>
          <ModalTextBox title="Daily Comparison" removeHorizontalPadding>
            <View className="gap-y-2 px-4">
              <DefaultText>{dailyComparisonText}</DefaultText>
            </View>

            <HorizontalLine />

            <BarComparison
              todaysHigh={Math.round(todaysGustHigh)}
              tomorrowsHigh={Math.round(tomorrowsGustHigh)}
              unit={windUnit}
            />
          </ModalTextBox>
        </>
      )}

      <ModalTextBox title={"About Wind Speed and Gusts"}>
        <DefaultText>{windDefinition}</DefaultText>
      </ModalTextBox>

      <ModalTextBox title={"Beaufort Scale"} removeHorizontalPadding>
        <View className="gap-y-3">
          <BeaufortScale />
        </View>
      </ModalTextBox>

      <ModalTextBox title={"About the Beaufort Wind Scale"}>
        <DefaultText
          className=""
          style={{ lineHeight: 18, letterSpacing: 0.2 }}
        >
          {bftDefinition}
        </DefaultText>
      </ModalTextBox>

      <SettingsTextBoxContainer title={"Other Units"}>
        <SettingsTextBoxList
          arr={windOptionUnitArr}
          interactableType="dropdown"
          selectedValue="mph"
          onSelect={selectOtherUnits}
          openUpward
        />
      </SettingsTextBoxContainer>
    </View>
  );
};

export default WindModalDescription;
