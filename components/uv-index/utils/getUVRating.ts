export const getUVRating = (UV: number) =>
  UV <= 2
    ? "Low"
    : UV <= 5
    ? "Moderate"
    : UV <= 7
    ? "High"
    : UV <= 10
    ? "Very High"
    : "Extreme";
