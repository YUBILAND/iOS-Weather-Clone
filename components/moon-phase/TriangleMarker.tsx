import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ICON_BLACK_BORDER_SIZE, ICON_SIZE } from "./utils/constants";

interface TriangleMarkerProps {
  width: number;
}
const TriangleMarker = ({ width }: TriangleMarkerProps) => {
  return (
    <>
      <Ionicons
        className="absolute top-0 left-[50%] "
        name="triangle"
        size={ICON_BLACK_BORDER_SIZE}
        color={"black"}
        style={{
          transform: [{ rotate: "180deg" }],
          zIndex: 1,
          left: width / 2 - ICON_BLACK_BORDER_SIZE / 2,
          alignSelf: "flex-start",
        }}
      />
      <Ionicons
        className="absolute top-0 left-[50%] "
        name="triangle"
        size={ICON_SIZE}
        color={"white"}
        style={{
          transform: [{ rotate: "180deg" }],
          zIndex: 1,
          left: width / 2 - ICON_SIZE / 2,
          alignSelf: "flex-start",
        }}
      />
    </>
  );
};

export default TriangleMarker;
