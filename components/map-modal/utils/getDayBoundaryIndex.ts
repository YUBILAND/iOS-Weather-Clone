import { useEffect, useRef } from "react";
import { getSliderTime } from "./getSliderTime";

export const getDayBoundaryIndex = (epochArr: number[] | null) => {
  const dayBoundaryIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (epochArr) {
      const lastIndex = epochArr.length;

      for (let i = 0; i < lastIndex; i++) {
        const indexTime = getSliderTime(i, lastIndex, epochArr);
        const hour = indexTime.split(":")[0];
        const min = indexTime.split(":")[1];

        if (parseInt(hour) === 0 && parseInt(min) === 0) {
          dayBoundaryIndexRef.current = i;
        }
      }
    }
  }, [epochArr]);

  return { dayBoundaryIndexRef };
};
