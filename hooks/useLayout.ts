import { useState, useCallback } from "react";
import { LayoutChangeEvent } from "react-native";

export const useLayout = () => {
  const [layout, setLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setLayout({ x, y, width, height });
  }, []);

  return { layout, onLayout };
};
