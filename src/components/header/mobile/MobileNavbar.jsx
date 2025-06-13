import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { array, bool, string } from "prop-types";
import classNames from "classnames";

import NavMenu from "@components/header/desktop/NavMenu";
import { TextLarge } from "@components/TextTypography";
import { MenuIcon } from "@components/icons";
import FullscreenMenu from "@components/header/mobile/FullscreenMenu";
// import SlidingMobileModal from "@/components/header/mobile/SlidingMobileModal";

function MobileNavbar({ menuItems, isLoading, isSuccess, className }) {
  // 互動視窗
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navClasses = classNames(
    className,
    "mobile-navbar",
    "navbar",
    "navbar-light",
    "navbar-expand-lg",
    "navbar-custom",
    "py-sm-5",
    "py-2",
    "px-sm-2",
    "px-3",
    "fixed-top",
    { "navbar-hidden": isMenuOpen }
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const renderNavMenu = () => {
    if (isLoading)
      return <TextLarge className="me-auto py-2 px-xl-3 px-lg-2">載入精選目錄中…</TextLarge>;
    if (isSuccess) return <NavMenu menuItems={menuItems} />;
  };

  return (
    <>
      <nav ref={navRef} className={navClasses}>
        <div className="container-fluid d-flex align-items-center">
          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img src={`${APP_BASE}Logo.svg`} alt="拾光堂 logo" />
          </Link>

          <button className="btn btn-link p-0 text-gray-500" type="button" onClick={toggleMenu}>
            <MenuIcon size={48} />
          </button>
        </div>
      </nav>

      {/* <SlidingMobileModal isMenuOpen={isMenuOpen} closeMenu={closeMenu} path={APP_BASE} /> */}
      <FullscreenMenu isMenuOpen={isMenuOpen} closeMenu={closeMenu} path={APP_BASE} />
    </>
  );
}

MobileNavbar.propTypes = {
  menuItems: array.isRequired,
  className: string,
  isLoading: bool.isRequired,
  isSuccess: bool.isRequired,
};

export default MobileNavbar;
