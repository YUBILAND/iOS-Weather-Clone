export const getMinutesFromEpoch = (epochArr: number[] | null) => {
  if (epochArr) {
    let epochDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
    epochDate.setUTCSeconds(epochArr[epochArr.length - 1]);
    return epochDate?.getMinutes();
  }
};
