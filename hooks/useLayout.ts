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
    setLayout((prev) => {
      if (
        !prev ||
        prev.x !== x ||
        prev.y !== y ||
        prev.width !== width ||
        prev.height !== height
      ) {
        return { x, y, width, height };
      }
      return prev;
    });
  }, []);

  return { layout, onLayout };
};
