export const interpolateRainData = (rainArr: number[] | null) => {
  if (rainArr !== null) {
    const arrSize = rainArr.length;

    const desiredArrSize = 61;

    if ((desiredArrSize - arrSize) % (arrSize - 1) === 0) {
      // Even amount of array gap additions
      const extrasNeededInGap = Math.floor(
        (desiredArrSize - arrSize) / (arrSize - 1)
      );
      let newArr: number[] = [rainArr[0]];
      for (let i = 0; i < arrSize - 1; i++) {
        const difference = rainArr[i + 1] - rainArr[i];
        for (let j = 0; j < extrasNeededInGap; j++) {
          newArr = [
            ...newArr,
            parseFloat(
              (
                rainArr[i] +
                (difference / (extrasNeededInGap + 1)) * (j + 1)
              ).toFixed(2)
            ),
          ];
        }
        newArr = [...newArr, rainArr[i + 1]];
      }
      return newArr;
    } else {
      console.log("Not able to interpolate uneven desired array size");
      return null;
    }
  } else {
    // Uneven
    return null;
  }
};
