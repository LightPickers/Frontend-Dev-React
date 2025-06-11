import { useMatches, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { TextMedium } from "@/components/TextTypography";

const useBreadcrumbs = () => {
  const matches = useMatches();
  const location = useLocation();
  console.log(matches);

  const crumbs = matches
    .filter(match => typeof match.handle?.crumb === "function")
    .map((match, index, all) => {
      const isCurrentPage = index === all.length - 1;
      const pathname = match.pathname ?? location.pathname;

      const element = match.handle.crumb({
        data: match.data,
        params: match.params,
        pathname,
        isCurrentPage,
      });

      return {
        pathname,
        element,
      };
    });

  // 若為商品詳情頁，但缺少「商品總覽」，手動補上
  const isProductDetail =
    location.pathname.startsWith("/products/") && !crumbs.some(c => c.pathname === "/products");

  if (isProductDetail) {
    crumbs.unshift({
      pathname: "/products",
      element: (
        <TextMedium as={Link} to="/products" className="fw-normal">
          商品總覽
        </TextMedium>
      ),
    });
  }

  // 若沒有首頁，也補上
  const hasHome = crumbs.some(c => c.pathname === "/");
  if (!hasHome) {
    crumbs.unshift({
      pathname: "/",
      element: (
        <TextMedium as={Link} to="/" className="fw-normal">
          首頁
        </TextMedium>
      ),
    });
  }

  return crumbs;
};

export default useBreadcrumbs;
