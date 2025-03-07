import { useRef } from "react";
import { MoonPhase } from "./constants";

export const getRemoveAnimationRef = (currentPhase: MoonPhase) => {
  // Remove Animation when transitioning in reverse to prevent flicker
  const prevRef = useRef(currentPhase);
  const removeAnimationRef = useRef(false);

  // Store previous value to compare when chart area changes sides, then remove animation
  if (prevRef.current !== currentPhase) {
    removeAnimationRef.current = true;
  } else {
    removeAnimationRef.current = false;
  }
  prevRef.current = currentPhase;

  return removeAnimationRef;
};
