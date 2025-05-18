import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Collapse } from "bootstrap";

import { TextLarge, TextMedium } from "@components/TextTypography";
import { BtnPrimary } from "@components/Buttons";
import { SearchIcon, FavoriteIcon, CartIcon, MenuIcon } from "@components/icons";
import { useGetFeaturedCategoryQuery } from "@features/products/productApi";

function MobileNavbar() {
  const user = useSelector(state => state.auth.user);
  const APP_BASE = import.meta.env.VITE_APP_BASE;
  const navRef = useRef(null);
  const collapseRef = useRef(null);
  const collapseInstanceRef = useRef(null);
  const { data: categories } = useGetFeaturedCategoryQuery(); // 目前測不到
  console.log(categories);
  // const navItems = [
  //   { name: "相機", path: "/products?category=cameras" },
  //   { name: "機身", path: "/products?category=camera_bodies" },
  //   { name: "鏡頭", path: "/products?category=lens" },
  //   { name: "配件", path: "/products?category=accessories" },
  //   { name: "收購流程", path: "/sell" },
  //   // { name: "其他", path: "#" },
  // ];

  useEffect(() => {
    const handleNavScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 0) {
        navRef.current.classList.add("scrollDown");
      } else {
        navRef.current.classList.remove("scrollDown");
      }
    };

    window.addEventListener("scroll", handleNavScroll);
    return () => {
      window.removeEventListener("scroll", handleNavScroll);
    };
  }, []);

  useEffect(() => {
    collapseInstanceRef.current = Collapse.getOrCreateInstance(collapseRef.current, {
      toggle: false,
    });

    return () => {
      collapseInstanceRef.current?.dispose();
    };
  }, []);

  const handleToggle = () => {
    collapseInstanceRef.current?.toggle();
  };

  return (
    <nav
      ref={navRef}
      className="navbar navbar-custom navbar-light navbar-expand-lg py-lg-5 py-2 px-lg-0 px-3 fixed-top"
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={`${APP_BASE}Logo.svg`} alt="拾光堂 logo" />
        </Link>

        {/* 漢堡選單 */}
        <button
          className="navbar-toggler border-0 p-0 text-gray-500"
          type="button"
          onClick={handleToggle}
          // aria-controls="navbarContent"
          // aria-expanded="false"
          // aria-label="Toggle navigation"
        >
          <MenuIcon size={48} />
        </button>

        {/* 導航項目 */}
        <div ref={collapseRef} className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex gap-5">
            {/* {navItems.map((item, index) => (
              <li key={index} className="py-2 px-3">
                <TextLarge as={NavLink} to={item.path}>
                  {item.name}
                </TextLarge>
              </li>
            ))} */}
            <li className="nav-item py-2 px-3">
              <TextLarge as={NavLink} to="/account/profile/settings" className="nav-link">
                會員中心
              </TextLarge>
            </li>
            <li className="nav-item py-2 px-3">
              <TextLarge as={NavLink} to="/register" className="nav-link">
                註冊
              </TextLarge>
            </li>
          </ul>
          {/* icon */}
          <div className="d-flex align-items-center gap-7">
            <div className="d-flex align-items-center gap-3">
              <TextMedium as={Link} className="btn btn-link">
                <SearchIcon title="搜尋商品" />
              </TextMedium>
              <TextMedium as={Link} className="btn btn-link">
                <FavoriteIcon title="查看收藏清單" />
              </TextMedium>
              <TextMedium as={Link} className="btn btn-link">
                <CartIcon title="查看購物車" />
              </TextMedium>
            </div>
            {user ? (
              <div>
                <Link to="/account/profile/settings" className="user-avatar">
                  <img
                    src={user.photo || `${APP_BASE}icon/default_avatar.svg`}
                    alt={user.name}
                    className="user-avatar rounded-circle bg-primary-100 p-1"
                    title="前往會員中心"
                  />
                </Link>
              </div>
            ) : (
              <BtnPrimary as={Link} to="/login">
                註冊∕登入
              </BtnPrimary>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MobileNavbar;
