import { MoonPhase } from "./constants";

export const getMoonRotationDegress = (
  currentPhase: MoonPhase,
  moonGraphLumin: number
) => {
  return (
    90 +
    ((currentPhase === "waxing" ? moonGraphLumin : 100 - moonGraphLumin) /
      100) *
      20
  );
};
