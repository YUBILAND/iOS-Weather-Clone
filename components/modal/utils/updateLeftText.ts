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

  useEffect(() => {
    const leftText = {
      topText: id === 0 ? currentText.topText ?? "" : otherText.topText ?? "",
      topTextSmall:
        id === 0
          ? currentText.topTextSmall ?? ""
          : otherText.topTextSmall ?? "",

      topTextGray:
        id === 0 ? currentText.topTextGray ?? "" : otherText.topTextGray ?? "",
      bottomText:
        id === 0 ? currentText.bottomText ?? "" : otherText.bottomText ?? "",
      image: id === 0 ? currentText.image ?? "" : otherText.image ?? "",
    };

    updateShared(leftText, id);
  }, [tempUnit, otherUnits]);
};
