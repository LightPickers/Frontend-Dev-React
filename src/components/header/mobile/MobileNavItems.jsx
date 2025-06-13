import { Link } from "react-router-dom";
import { func } from "prop-types";
import { useState } from "react";
import classNames from "classnames";

import { TextLarge, TextMedium } from "@/components/TextTypography";
import { useGetFeaturedCategoryQuery } from "@/features/products/productApi";
import getStaticMobileNavData from "@/data/mobileStaticNavItems";
import useOutsideClick from "@hooks/useOutsideClick";
import { ArrowDownIcon } from "@/components/icons";

function MobileNavItems({ closeMenu }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useOutsideClick(() => {
    setOpenDropdown(null);
  });

  const { data: featuredCategoryResponse, isSuccess } = useGetFeaturedCategoryQuery();
  const categories = featuredCategoryResponse?.data ?? [];
  const categoryChidren = categories.map(category => {
    const { id, name } = category;
    return {
      name,
      path: `/products?category_id=${id}`,
    };
  });
  const categoryData = {
    name: "矚目類別",
    hasChild: true,
    path: null,
    children: categoryChidren,
  };
  const navStaticData = getStaticMobileNavData();
  const navData = [...navStaticData, categoryData];

  // 切換下拉選單
  const toggleDropdown = itemName => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  return (
    <section ref={dropdownRef} className="mobile-navitem-container">
      <ul className="d-flex flex-column gap-sm-6 gap-4">
        {isSuccess &&
          navData.map(navItem => {
            const { name, path, hasChild } = navItem;

            // 如果有子項目
            if (hasChild) {
              return (
                <li key={name}>
                  <TextLarge
                    as="a"
                    role="button"
                    className="d-flex justify-content-between align-items-center w-100 mb-2"
                    onClick={() => toggleDropdown(name)}
                    aria-expanded={openDropdown === name}
                  >
                    {name}
                    <ArrowDownIcon
                      className={classNames("arrow-down", { rotate: openDropdown === name })}
                    />
                  </TextLarge>
                  {openDropdown === name && (
                    <ul className="mobile-dropdown">
                      {navItem.children.map(subItem => {
                        const { name: subName, path: subPath } = subItem;
                        return (
                          <li key={subName}>
                            <TextMedium
                              as={Link}
                              role="button"
                              to={subPath}
                              onClick={closeMenu}
                              className="d-block w-100 fw-normal py-1"
                            >
                              {subName}
                            </TextMedium>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // 如果沒有子項目且有路徑
            if (path) {
              return (
                <li key={name} className="d-flex align-items-center">
                  <TextLarge
                    as={Link}
                    role="button"
                    to={path}
                    onClick={closeMenu}
                    className="w-100"
                  >
                    {name}
                  </TextLarge>
                </li>
              );
            }

            // 如果既沒有子項目也沒有路徑，就不渲染
            return null;
          })}
      </ul>
    </section>
  );
}

MobileNavItems.propTypes = {
  closeMenu: func.isRequired,
};

export default MobileNavItems;
