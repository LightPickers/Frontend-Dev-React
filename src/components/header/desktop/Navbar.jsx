import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { array, bool, string } from "prop-types";
import classNames from "classnames";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import NavMenu from "@components/header/desktop/NavMenu";
import UserMenu from "@components/header/desktop/UserMenu";
import { MenuIcon } from "@components/icons";

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
      return (
        <div className="d-flex gap-4">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} height={30} width={80} />
          ))}
        </div>
      );
    if (isSuccess) return <NavMenu menuItems={menuItems} />;
  };

  return (
    <nav ref={navRef} className={navClasses}>
      <div className="container-xl container-fluid px-xl-0 px-4 d-flex align-items-center">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={`${APP_BASE}Logo.svg`} alt="拾光堂 logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          // data-bs-toggle="collapse"
          // data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <MenuIcon />
        </button>

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
