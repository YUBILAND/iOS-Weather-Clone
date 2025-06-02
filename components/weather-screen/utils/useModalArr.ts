import { SelectModal } from "@/components/modal/utils/modalConstants";
import { useMemo } from "react";

export const useModalArr = (
  showThisModal: (modalName: SelectModal, resetIndex?: boolean) => void
) => {
  return useMemo(() => {
    return {
      dayCondition: () => showThisModal("conditions", false),
      conditions: () => showThisModal("conditions"),
      airQuality: () => showThisModal("airQuality"),
      uv: () => showThisModal("uv"),
      wind: () => showThisModal("wind"),
      humidity: () => showThisModal("humidity"),
      airPressure: () => showThisModal("airPressure"),
      feelsLike: () => showThisModal("feelsLike"),
      precipitation: () => showThisModal("precipitation"),
      visibility: () => showThisModal("visibility"),
      averages: () => showThisModal("averages"),
      sunPhase: () => showThisModal("sunPhase"),
      moonPhase: () => showThisModal("moonPhase"),
      rainHour: () => showThisModal("rainHour"),
    };
  }, [showThisModal]);
};
