import { NavLink } from "react-router-dom";
import { string } from "prop-types";

import { TextMedium } from "@components/TextTypography";

function ProductContentNav({ id }) {
  const PRODUCT_PATH = `/products/${id}`;
  const navItems = [
    { label: "商品介紹", path: "" },
    { label: "詳細規格", path: `${PRODUCT_PATH}/specification` },
    // { label: "會員評價", path: `${PRODUCT_PATH}/review` },
  ];
  return (
    <nav className="product-nav row">
      <ul className="ps-0 mb-0 d-flex align-items-center">
        {navItems.map((item, index) => {
          const { label, path } = item;
          return (
            <li key={index} className="nav-separator">
              <TextMedium as={NavLink} end to={path}>
                {label}
              </TextMedium>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

ProductContentNav.propTypes = {
  id: string.isRequired,
};

export default ProductContentNav;
