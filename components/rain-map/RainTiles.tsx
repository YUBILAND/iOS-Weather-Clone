import React from "react";
import { UrlTile } from "react-native-maps";

interface RainTilesProps {
  epochArr: number[] | null;
  visibleTileIndex: number;
}
const RainTiles = ({ epochArr, visibleTileIndex }: RainTilesProps) => {
  return (
    epochArr && (
      <UrlTile
        urlTemplate={`https://tilecache.rainviewer.com/v2/radar/${epochArr[visibleTileIndex]}/256/{z}/{x}/{y}/3/0_0.png`}
        maximumZ={12}
        tileSize={256}
        zIndex={10}
        opacity={0.7}
      />
    )
  );
};

export default React.memo(RainTiles);
