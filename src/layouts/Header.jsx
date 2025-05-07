import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

import { TextLarge } from "@components/TextTypography";
import { BtnPrimary } from "@components/Buttons";

function Header() {
  const [isLogin, setIsLogin] = useState(null);
  const navItems = [
    { name: "相機", path: "/products?category=cameras" },
    { name: "機身", path: "/products?category=camera_bodies" },
    { name: "鏡頭", path: "/products?category=lens" },
    { name: "配件", path: "/products?category=accessories" },
    { name: "收購流程", path: "/sell" },
    { name: "其他", path: "#" },
  ];
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-5">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src="/public/logo.svg" alt="拾光堂 logo" />
        </Link>

        {/* 導航項目 */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="me-auto mb-2 mb-lg-0 d-flex gap-5">
            {navItems.map((item, index) => (
              <li key={index} className="py-2 px-3">
                <TextLarge as={NavLink} to={item.path}>
                  {item.name}
                </TextLarge>
              </li>
            ))}
          </ul>
          {/* icon */}
          <div className="d-flex gap-7">
            <div className="d-flex align-items-center gap-3">
              <Link className="btn btn-link">
                <img src="/public/icon/search.svg" alt="搜尋" />
              </Link>
              <Link className="btn btn-link">
                <img src="/public/icon/favorite.svg" alt="收藏清單" />
              </Link>
              <Link className="btn btn-link">
                <img src="/public/icon/cart.svg" alt="購物車" />
              </Link>
            </div>
            {isLogin ? (
              <div>
                <Link to="/profile" className="user-avatar">
                  <img
                    src="/api/placeholder/40/40"
                    alt="User Avatar"
                    className="rounded-circle"
                    width="32"
                    height="32"
                  />
                </Link>
              </div>
            ) : (
              <BtnPrimary>註冊∕登入</BtnPrimary>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
