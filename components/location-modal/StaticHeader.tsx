import React from "react";
import { View, Text } from "react-native";
import Search from "../atoms/Search";
import VisibleText from "./VisibleText";

interface StaticHeaderProps {
  hasCrossedPoint: boolean;
  showSearch: boolean;
  searchProps: any;
}

const StaticHeader = ({
  hasCrossedPoint,
  showSearch,
  searchProps,
}: StaticHeaderProps) => {
  console.log("rerendering?");
  return (
    <>
      {/* Hides when scrolled up  */}
      <VisibleText
        text="Weather"
        visible={hasCrossedPoint}
        exists={!showSearch}
        fontSize={32}
      />

      <View
        className=" py-4 relative z-40 flex-row items-center gap-x-2"
        style={{ opacity: hasCrossedPoint ? 0 : 1 }}
      >
        <Search {...searchProps} />
      </View>
    </>
  );
};

export default React.memo(StaticHeader);
