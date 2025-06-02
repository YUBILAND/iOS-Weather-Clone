export const getRainHourGraphData = (rainData: number[] | null | undefined) => {
  if (!rainData) return [];

  return Array(61)
    .fill(0)
    .map((_, idx) => ({
      minute: idx,
      mainBar: rainData[idx], // Using the fetched rain data
    }));
};
