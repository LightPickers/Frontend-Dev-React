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
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }

    prevPathnameRef.current = pathname;
  }, [pathname, matches]);

  return null;
}

export default ScrollToTop;
