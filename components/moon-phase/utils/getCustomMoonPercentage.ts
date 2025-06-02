import { MoonPhase } from "./constants";

const initialMoonPhase: MoonPhase = "waning";

export const getCustomMoonPercentage = (
  currentMoonPhase: MoonPhase,
  moonGraphLumin: number
) =>
  currentMoonPhase === initialMoonPhase
    ? Math.round(moonGraphLumin) + "%"
    : 100 - Math.round(moonGraphLumin) + "%";
