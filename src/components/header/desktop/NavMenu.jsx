import { array, bool } from "prop-types";
import { Link } from "react-router-dom";
import { useRef } from "react";

import { ArrowDownIcon } from "@components/icons";
import { TextLarge, TextMedium } from "@components/TextTypography";

function NavMenu({ menuItems }) {
  const hoverTimeouts = useRef({}); // 儲存每個 dropdown 的 timeout ID

  const handleMouseEnter = id => {
    clearTimeout(hoverTimeouts.current[id]);
    const dropdown = document.getElementById(`dropdown-${id}`);
    dropdown?.classList.add("show");
  };

  const handleMouseLeave = id => {
    hoverTimeouts.current[id] = setTimeout(() => {
      const dropdown = document.getElementById(`dropdown-${id}`);
      dropdown?.classList.remove("show");
    }, 50);
  };

  return (
    <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex gap-xxl-5 gap-xl-4 gap-lg-3 d-flex">
      {menuItems.map(category => (
        <li
          key={category.id}
          id={`dropdown-${category.id}`}
          onMouseEnter={() => handleMouseEnter(category.id)}
          onMouseLeave={() => handleMouseLeave(category.id)}
          // px-xl-3 px-lg-2
          className="nav-item dropdown py-2 px-xl-3 px-lg-2"
        >
          <TextLarge
            as="a"
            className="nav-link d-flex align-items-center"
            role="button"
            aria-expanded="false"
            fluid
          >
            {category.name}
            <ArrowDownIcon
              //d-none d-xl-flex
              className="nav-dropdown-icon "
            />
          </TextLarge>

          <ul className="dropdown-menu dropdown-wrapper mt-3">
            {category.brands.map(brand => (
              <li key={brand.id} className="dropdown-item py-1 px-2">
                <TextMedium
                  className="d-block"
                  as={Link}
                  to={`/products?category_id=${category.id}&brand_id=${brand.id}`}
                >
                  {brand.name}
                </TextMedium>
              </li>
            ))}
          </ul>
        </li>
      ))}

      {/* <li className="nav-item py-2 px-xl-3 px-lg-2">
        <TextLarge as={NavLink} to="/sell" className="nav-link">
          其他
        </TextLarge>
      </li> */}
    </ul>
  );
}

NavMenu.propTypes = {
  menuItems: array.isRequired,
  isLoading: bool.isRequired,
  isSuccess: bool.isRequired,
};

export default NavMenu;
