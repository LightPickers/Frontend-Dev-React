import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import DesktopNavItems from "@components/header/DesktopNavItems";
import DesktopNavUserItems from "@components/header/DestopNavUserItems";

function DesktopNavbar({ menuItems, className }) {
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

  return (
    <nav ref={navRef} className={navClasses}>
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src={`${APP_BASE}Logo.svg`} alt="拾光堂 logo" />
        </Link>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* 網頁導航項目 */}
          <DesktopNavItems menuItems={menuItems} />
          {/* 使用者項目 */}
          <DesktopNavUserItems />
        </div>
      </div>
    </nav>
  );
}

DesktopNavbar.propTypes = {
  menuItems: PropTypes.array,
  className: PropTypes.string,
};

export default DesktopNavbar;
