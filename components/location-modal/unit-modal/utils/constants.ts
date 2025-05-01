export type InteractableType = "check" | "dropdown" | "toggle";

export const overflowMenuArr: {
  [key: string]: { name: string; label: string }[];
} = {
  wind: [
    { name: "mph", label: "Miles per hour (mph)" },
    { name: "kmh", label: "Kilometers per hour (km/h)" },
    { name: "mss", label: "Meters per second (ms/s)" },
    { name: "bft", label: "Beaufort (bft)" },
    { name: "kn", label: "Knots (kn)" },
  ],
  precipitation: [
    { name: "in", label: "Inches (in)" },
    { name: "mm", label: "Millimeters (mm)" },
  ],
  pressure: [
    { name: "mbar", label: "Millibars (mbar)" },
    { name: "inHg", label: "Inches of mercury (inHg)" },
    { name: "mmHg", label: "Millimeters of mercury (mmHg)" },
    { name: "hPa", label: "Hectopasscals (hPa)" },
    { name: "kPa", label: "Kilopascals (kPa)" },
  ],
  distance: [
    { name: "mi", label: "Miles (mi)" },
    { name: "km", label: "Kilometers (km)" },
  ],
};

export const tempUnitArr = [
  { name: "celsius", label: "Celsius (°C)" },
  { name: "fahrenheit", label: "Fahrenheit (°F)" },
  { name: "system", label: "Use System Settings" },
];
export const timeUnitArr = [{ name: "time", label: "Time Format" }];
export const otherUnitArr = [
  { name: "wind", label: "Wind" },
  { name: "precipitation", label: "Precipitation" },
  { name: "pressure", label: "Pressure" },
  { name: "distance", label: "Distance" },
];

export const windOptionUnitArr = [{ name: "wind", label: "Unit" }];
export const precipOptionUnitArr = [{ name: "precipitation", label: "Unit" }];
export const pressureOptionUnitArr = [{ name: "pressure", label: "Unit" }];
export const distanceOptionUnitArr = [{ name: "distance", label: "Unit" }];
