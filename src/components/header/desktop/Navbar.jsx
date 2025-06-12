import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { array, bool, string } from "prop-types";
import classNames from "classnames";

import NavMenu from "@components/header/desktop/NavMenu";
import UserMenu from "@components/header/desktop/UserMenu";
import { TextLarge } from "@components/TextTypography";

function Navbar({ menuItems, isLoading, isSuccess, className }) {
  const navClasses = classNames(
    className,
    "navbar",
    "navbar-light",
    "navbar-expand-lg",
    "navbar-custom",
    "py-md-5",
    "py-2",
    "px-md-0",
    "px-3",
    "fixed-top"
  );

  const APP_BASE = import.meta.env.VITE_APP_BASE;
  const navRef = useRef(null);

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

  const renderNavMenu = () => {
    if (isLoading)
      return <TextLarge className="me-auto py-2 px-xl-3 px-lg-2">載入精選目錄中…</TextLarge>;
    if (isSuccess) return <NavMenu menuItems={menuItems} />;
  };

  return (
    <nav ref={navRef} className={navClasses}>
      <div className="container-xl container-fluid px-xl-0 px-4 d-flex align-items-center">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={`${APP_BASE}Logo.svg`} alt="拾光堂 logo" />
        </Link>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* 網頁導航項目 */}
          {renderNavMenu()}
          {/* 使用者項目 */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  menuItems: array.isRequired,
  className: string,
  isLoading: bool.isRequired,
  isSuccess: bool.isRequired,
};

export default Navbar;
