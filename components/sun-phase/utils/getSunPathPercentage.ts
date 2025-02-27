export const getSunPathPercentage = (
  sunPhaseData: {
    hour: number;
    sunPath: number;
    sunPosition: number | null;
    phaseLine: number;
  }[]
) => {
  const sunPaths = sunPhaseData.map((item) => item.sunPath); // Extract all sunPath values
  const maxSunPath = Math.max(...sunPaths); // Get the maximum value
  const minSunPath = Math.min(...sunPaths); // Get the minimum value

  const sunPosition = sunPhaseData.map((item) => item.sunPosition); // Extract all sunPosition values
  const sunIsHere = sunPosition.filter((pos) => pos)[0];

  const sunPathRange = Math.abs(maxSunPath - minSunPath);
  const sunPathPercentage = (sunIsHere! + Math.abs(minSunPath)) / sunPathRange;
  return sunPathPercentage;
};
