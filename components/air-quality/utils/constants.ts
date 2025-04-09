export function lerp(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x: number
): number {
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
}

export function pm25_aqi(pm25: number) {
  const c = Math.floor(10 * pm25) / 10;
  const a =
    c < 0
      ? 0 // values below 0 are considered beyond AQI
      : c < 12.1
      ? lerp(0, 50, 0.0, 12.0, c)
      : c < 35.5
      ? lerp(51, 100, 12.1, 35.4, c)
      : c < 55.5
      ? lerp(101, 150, 35.5, 55.4, c)
      : c < 150.5
      ? lerp(151, 200, 55.5, 150.4, c)
      : c < 250.5
      ? lerp(201, 300, 150.5, 250.4, c)
      : c < 350.5
      ? lerp(301, 400, 250.5, 350.4, c)
      : c < 500.5
      ? lerp(401, 500, 350.5, 500.4, c)
      : 500; // values above 500 are considered beyond AQI
  return Math.round(a);
}
