import { useEffect, useMemo, useRef, useState } from "react";

export const useTileData = () => {
  const [epochArrRaw, setEpochArrRaw] = useState<number[] | null>(null);
  const [visibleTileIndex, setVisibleTileIndex] = useState(0);
  useEffect(() => {
    fetch("https://tilecache.rainviewer.com/api/maps.json")
      .then((res) => res.json())
      .then((data: number[]) => {
        setEpochArrRaw(data);
        // Data has last two hours in 10 minute steps. Length is 13.
        setVisibleTileIndex(data.length - 1);
      })
      .catch((err) => console.error("Failed to fetch radar tiles:", err));
  }, []);

  const epochArr = useMemo(() => epochArrRaw, [epochArrRaw]);

  return { epochArr, visibleTileIndex, setVisibleTileIndex };
};
