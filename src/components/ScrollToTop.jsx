import { useEffect, useRef } from "react";
import { useLocation, useMatches } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const matches = useMatches();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const isProductPage = matches.some(match => match.id === "product_detail");

    if (isProductPage) {
      const currentProductId = pathname.match(/\/products\/([^/]+)/)?.[1];
      const previousProductId = prevPathnameRef.current.match(/\/products\/([^/]+)/)?.[1];

      const isDifferentProduct = !previousProductId || currentProductId !== previousProductId;

      if (isDifferentProduct) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant", // 避免滾動感
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }

    prevPathnameRef.current = pathname;
  }, [pathname, matches]);

  return null;
}

export default ScrollToTop;
