export const colors = {
  bgWhite: (opacity: number) => `rgba(255,255,255, ${opacity})`,
  bgBlack: (opacity: number) => `rgba(0,0,0, ${opacity})`,
  bgMediumGray: (opacity: number) => `rgba(49,48,53, ${opacity})`,

  bgBlue: (opacity: number = 1) => `rgba(124,197,227, ${opacity})`,

  // lightGray: "#777679",
  lightGray: `rgba(255,255,255, 0.6)`,
  mediumGray: "#313035",
  darkGray: "#1C1C1E",
  blue: "rgba(124,197,227,1)",
  green: "rgb(72, 227, 82)",
};

export type Colors = "bgWhite" | "bgBlack" | "bgMediumGray" | "bgBlue";
