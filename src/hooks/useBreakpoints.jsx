import { useEffect, useState } from "react";

const BREAKPOINTS = {
  xs: "(max-width: 575.98px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1400px)",
  smDown: "(max-width: 767.98px)",
  mdDown: "(max-width: 991.98px)",
  lgDown: "(max-width: 1199.98px)",
  mdUp: "(min-width: 768px)",
  lgUp: "(min-width: 992px)",
  xlUp: "(min-width: 1200px)",
};

function useBreakpoint(bpName) {
  const query = BREAKPOINTS[bpName];
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (!query) return;

    const mediaQuery = window.matchMedia(query);
    const handler = () => setMatches(mediaQuery.matches);

    handler(); // 初始判斷
    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

export default useBreakpoint;

/*
使用範例：
  const isSmDown = useBreakpoint("smDown"); // 小於 768px
  const isMdUp = useBreakpoint("mdUp");     // 大於等於 768px
*/
