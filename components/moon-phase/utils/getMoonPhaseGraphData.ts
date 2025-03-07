export const getMoonPhaseGraphData = (moonGraphLumin: number) =>
  Array(30)
    .fill(0)
    .map((_, index) => {
      // range is [-10, 10] for graph
      const A = -10 + (moonGraphLumin / 100) * 20; // amplitude
      const r = 8;
      const x = index - 15;

      return {
        day: x,
        moonPath: -A * Math.pow(Math.cos((x * Math.PI) / (2 * r)), 1 / 2.2),
        sunPosition: 0,
        phaseLine: 0,
      };
    });
