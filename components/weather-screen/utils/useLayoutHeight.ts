import { useLayout } from "@/hooks/useLayout";
import { useEffect, useState } from "react";

export const useLayoutHeight = () => {
  const { layout, onLayout } = useLayout();
  const [layoutHeight, setLayoutHeight] = useState<number | null>(null);

  useEffect(() => {
    if (layout) {
      setLayoutHeight(layout.height);
    }
  }, [layout]);

  return { layout, onLayout, layoutHeight };
};
