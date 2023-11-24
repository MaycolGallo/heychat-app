import { useState, useEffect } from "react";
import { useLayoutEffect } from "react";

/**
 * Returns the current viewport size as an object with `width` and `height` properties.
 */

export function useViewportSize() {
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    function handleResize() {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    }

    if (typeof window !== "undefined") {
      handleResize(); // Get initial viewport size
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return viewportSize;
}
