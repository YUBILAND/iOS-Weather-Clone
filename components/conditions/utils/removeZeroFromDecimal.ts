export const removeZeroFromDecimal = (precip: string) => {
  if (parseFloat(precip) === 0) {
    return 0;
  }

  return precip[0] === "0" ? "." + precip.split(".")[1] : precip;
};
