import { useEffect } from "react";
import { useLocation, useMatches } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  const matches = useMatches();

  useEffect(() => {
    const excludedRouteIds = ["product_detail"];
    const shouldExclude = matches.some(match => excludedRouteIds.includes(match.id));

    if (!shouldExclude) window.scrollTo(0, 0);
  }, [pathname, matches]);

  return null;
}

export default ScrollToTop;
