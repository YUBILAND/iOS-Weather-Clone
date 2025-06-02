import React from "react";
import { UrlTile } from "react-native-maps";

interface RainTilesProps {
  epochArr: number[] | null;
  visibleTileIndex: number;
}
const RainTiles = ({ epochArr, visibleTileIndex }: RainTilesProps) => {
  return (
    epochArr &&
    epochArr.map((timeStamp, index) => {
      return (
        <UrlTile
          key={index}
          urlTemplate={`https://tilecache.rainviewer.com/v2/radar/${timeStamp}/256/{z}/{x}/{y}/3/0_0.png`}
          maximumZ={12}
          tileSize={256}
          zIndex={10}
          opacity={index === visibleTileIndex ? 0.7 : 0}
        />
      );
    })
  );
};

export default React.memo(RainTiles);
