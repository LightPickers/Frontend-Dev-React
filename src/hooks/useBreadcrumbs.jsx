import { Link, useLocation, useMatches } from "react-router-dom";

import { TextMedium } from "@components/TextTypography";

const useBreadcrumbs = () => {
  const matches = useMatches();
  const location = useLocation();

  let crumbs = matches
    .filter(match => match.handle?.crumb)
    .map(match => {
      const crumbElement = match.handle.crumb({
        data: match.data,
        params: match.params,
        pathname: match.pathname,
      });

      return {
        pathname: match.pathname,
        element: crumbElement,
      };
    });

  const isProductDetail =
    location.pathname.startsWith("/products/") && !crumbs.some(crumb => crumb.key === "/products");

  if (isProductDetail) {
    // 手動補上「商品總覽」
    crumbs.unshift({
      key: "/products",
      element: (
        <TextMedium as={Link} to="/products">
          商品總覽
        </TextMedium>
      ),
    });
  }

  // 確保首頁永遠在最前面
  const hasHome = crumbs.some(crumb => crumb.pathname === "/");
  if (!hasHome) {
    crumbs.unshift({
      pathname: "/",
      element: (
        <TextMedium as={Link} to="/">
          首頁
        </TextMedium>
      ),
    });
  }

  const lastIndex = crumbs.length - 1;
  crumbs = crumbs.map((crumb, index) => ({
    ...crumb,
    isCurrentPage: index === lastIndex,
  }));

  return crumbs;
};

export default useBreadcrumbs;
