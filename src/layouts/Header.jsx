import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { TextLarge } from "@components/TextTypography";
import { BtnPrimary } from "@components/Buttons";

function Header() {
  const user = useSelector(state => state.auth.user);
  const APP_BASE = import.meta.env.VITE_APP_BASE;
  const navRef = useRef(null);
  const navItems = [
    { name: "相機", path: "/products?category=cameras" },
    { name: "機身", path: "/products?category=camera_bodies" },
    { name: "鏡頭", path: "/products?category=lens" },
    { name: "配件", path: "/products?category=accessories" },
    { name: "收購流程", path: "/sell" },
    // { name: "其他", path: "#" },
  ];

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

  return (
    <nav ref={navRef} className="navbar navbar-custom navbar-light navbar-expand-lg py-5 fixed-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={`${APP_BASE}Logo.svg`} alt="拾光堂 logo" />
        </Link>

        {/* 導航項目 */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="me-auto mb-2 mb-lg-0 d-flex gap-5">
            {/* {navItems.map((item, index) => (
              <li key={index} className="py-2 px-3">
                <TextLarge as={NavLink} to={item.path}>
                  {item.name}
                </TextLarge>
              </li>
            ))} */}
            <li className="py-2 px-3">
              <TextLarge as={NavLink} to="/account/profile/settings">
                會員中心
              </TextLarge>
            </li>
            <li className="py-2 px-3">
              <TextLarge as={NavLink} to="/register">
                註冊
              </TextLarge>
            </li>
          </ul>
          {/* icon */}
          <div className="d-flex align-items-center gap-7">
            <div className="d-flex align-items-center gap-3">
              <Link className="btn btn-link">
                <img src={`${APP_BASE}icon/search.svg`} alt="搜尋" />
              </Link>
              <Link className="btn btn-link">
                <img src={`${APP_BASE}icon/favorite.svg`} alt="收藏清單" />
              </Link>
              <Link className="btn btn-link">
                <img src={`${APP_BASE}icon/cart.svg`} alt="購物車" />
              </Link>
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

export default Header;
