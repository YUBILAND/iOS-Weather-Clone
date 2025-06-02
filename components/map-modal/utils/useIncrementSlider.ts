import { useEffect } from "react";

export const useIncrementSlider = (
  isPlaying: boolean,
  setVisibleTileIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setVisibleTileIndex((prev: number) => (prev + 1) % 13);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);
};
