import { useEffect } from "react";
import { LeftTextType } from "../Modal";
import { useOtherUnits } from "@/hooks/useOtherUnits";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";

export const updateLeftText = (
  id: number,
  updateShared: (leftText: LeftTextType, id: number) => void,
  currentText: LeftTextType,
  otherText: LeftTextType
) => {
  const tempUnit = useTemperatureUnit();
  const otherUnits = useOtherUnits();

  const firstIndex = id === 0;

  const { topText, topTextSmall, topTextGray, bottomText, image } = currentText;
  const {
    topText: oTopText,
    topTextSmall: oTopTextSmall,
    topTextGray: oTopTextGray,
    bottomText: oBottomText,
    image: oImage,
  } = otherText;

  useEffect(() => {
    const leftText = {
      topText: firstIndex ? topText ?? "" : oTopText ?? "",
      topTextSmall: firstIndex ? topTextSmall ?? "" : oTopTextSmall ?? "",

      topTextGray: firstIndex ? topTextGray ?? "" : oTopTextGray ?? "",
      bottomText: firstIndex ? bottomText ?? "" : oBottomText ?? "",
      image: firstIndex ? image ?? null : oImage ?? null,
    };

    updateShared(leftText, id);
  }, [tempUnit, otherUnits]);
};
