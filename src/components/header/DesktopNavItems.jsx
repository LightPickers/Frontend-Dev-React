import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Dropdown } from "bootstrap";

import { ArrowDownIcon } from "@components/icons";
import { TextLarge, TextMedium } from "@components/TextTypography";

DesktopNavItems.propTypes = {
  menuItems: PropTypes.array,
};

function DesktopNavItems({ menuItems }) {
  const dropdownRefs = useRef([]);
  useEffect(() => {
    const currentDropdowns = dropdownRefs.current.slice(); // 複製當下 refs 陣列
    const handlersMap = new Map();

    currentDropdowns.forEach(el => {
      if (!el) return;

      const dropdown = Dropdown.getOrCreateInstance(el);
      const parent = el.closest(".dropdown");

      const show = () => {
        dropdown.show();

        // Bootstrap 5 dropdown._popper 是 Popper 實例
        const popper = dropdown._popper;
        if (popper && typeof popper.update === "function") {
          requestAnimationFrame(() => {
            popper.update();
          });
        }
      };
      const hide = () => dropdown.hide();
      // const toggle = e => {
      //   e.preventDefault();
      //   dropdown.toggle();

      //   // 點擊觸發後，也更新 Popper 定位
      //   const popper = dropdown._popper;
      //   if (popper && typeof popper.update === "function") {
      //     requestAnimationFrame(() => {
      //       popper.update();
      //     });
      //   }
      // };

      // 儲存事件處理器方便清除
      // handlersMap.set(el, { parent, show, hide, toggle });
      handlersMap.set(el, { parent, show, hide });

      parent.addEventListener("mouseenter", show);
      parent.addEventListener("mouseleave", hide);
    });

    return () => {
      currentDropdowns.forEach(el => {
        if (!el) return;

        const { parent, show, hide } = handlersMap.get(el) || {};

        if (parent) {
          parent.removeEventListener("mouseenter", show);
          parent.removeEventListener("mouseleave", hide);
        }
      });
    };
  }, []);

  return (
    <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex gap-5">
      {menuItems.map((category, index) => (
        <li key={category.id} className="nav-item dropdown py-2 px-3">
          <TextLarge
            ref={el => (dropdownRefs.current[index] = el)}
            as="a"
            className="nav-link d-flex align-items-center"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {category.name}
            <ArrowDownIcon />
          </TextLarge>

          {/* 下拉選單 */}
          <ul className="dropdown-menu dropdown-wrapper">
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
      <li className="nav-item py-2 px-3">
        <TextLarge as={NavLink} to="/sell" className="nav-link">
          其他
        </TextLarge>
      </li>
    </ul>
  );
}

export default DesktopNavItems;
