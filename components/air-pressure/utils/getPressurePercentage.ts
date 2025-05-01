import { convertPressureUnits } from "@/constants/conversion";

// For Pressure Card Semi-Circle Progress Percentage
export const getPressurePercentage = (inHg: number) => {
  const lowPressure = 980;
  const highPressure = 1045;
  const pressureHPA = convertPressureUnits(inHg, "hPa");
  const pressureRange = highPressure - lowPressure;
  const pressureFromZero = pressureHPA - lowPressure;
  const percentage = (pressureFromZero / pressureRange) * 100;

  return percentage;
};
