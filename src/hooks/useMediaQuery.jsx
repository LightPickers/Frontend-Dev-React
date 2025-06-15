import { useEffect, useState } from "react";

/**
 * 判斷是否符合指定媒體查詢條件。
 * @param {string} query - CSS 媒體查詢字串，例如 "(max-width: 768px)"
 * @returns {boolean} - 是否符合媒體查詢
 */

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handler = () => setMatches(mediaQuery.matches);
    handler(); // 初始執行一次

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export default useMediaQuery;

/* 使用範例：
const isSmallScreen = useMediaQuery("(max-width: 768px)");
const isDesktop = useMediaQuery("(min-width: 992px)");
const isPortraitPhone = useMediaQuery("(max-width: 576px) and (orientation: portrait)");
*/
