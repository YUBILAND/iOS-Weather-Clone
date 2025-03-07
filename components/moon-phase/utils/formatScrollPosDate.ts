export function formatScrollPosDate(scrollPosToDateString: string) {
  return (
    scrollPosToDateString.split(",")[1].replace(/\s+/, "") +
    ", " +
    scrollPosToDateString.split(",")[0]
  );
}
