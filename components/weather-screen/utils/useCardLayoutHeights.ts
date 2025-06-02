import { useCallback, useEffect, useState } from "react";

export const useCardLayoutHeights = () => {
  // const [layoutHeights, setLayoutHeights] = useState<number[]>([]);
  //   const addToLayoutHeightArr = useCallback(
  //     (layoutHeight: number) =>
  //       setLayoutHeights((prev) => [...prev, layoutHeight]),
  //     []
  //   );
  //   const addCardLayoutHeight = useCallback((cardLayoutHeight: number) => {
  //     useEffect(() => {
  //       if (cardLayoutHeight) {
  //         addToLayoutHeightArr(cardLayoutHeight ?? 0);
  //       }
  //     }, [cardLayoutHeight]);
  //   }, []);

  const [layoutHeights, setLayoutHeights] = useState<number[]>([]);

  const addToLayoutHeightArr = (layoutHeight: number) => {
    setLayoutHeights((prev) => [...prev, layoutHeight]);
  };

  return {
    layoutHeights,
    addToLayoutHeightArr,
  };
};
