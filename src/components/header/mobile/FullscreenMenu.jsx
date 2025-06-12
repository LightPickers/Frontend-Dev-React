import classNames from "classnames";
import { bool, func, string } from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { ChevronRightIcon, CloseIcon } from "@components/icons";
import { H3Secondary } from "@components/Headings";
import MobileSearchbar from "@components/header/mobile/MobileSearchbar";

function FullscreenMenu({ isMenuOpen, closeMenu, path }) {
  const user = useSelector(state => state.auth.user);
  const defaultPhoto = `${path}icon/default_avatar.svg`;
  const { photo = defaultPhoto, name = "" } = user ?? {};
  return (
    <section
      className={classNames("fullscreen-menu", "d-lg-none", "d-block", { active: isMenuOpen })}
    >
      {/* modal-header */}
      <div className="py-sm-5 py-2 px-sm-2 px-3">
        <div className="container-fluid mobile-menu-header">
          <Link className="navbar-brand" to="/" onClick={closeMenu}>
            <img src={`${path}Logo.svg`} alt="拾光堂 logo" />
          </Link>
          <button className="btn btn-link p-0 text-gray-500" type="button" onClick={closeMenu}>
            <CloseIcon size={48} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      {/* modal-body */}
      {user && (
        // px-sm-4  gap-4
        <section className="user-section py-3">
          <div className="user-wrapper gap-4 gap-sm-6 px-8 px-sm-12">
            {/* 頭像 */}
            <div className="avatar-container">
              <img src={photo} alt={name} className="object-fit-cover w-100 h-100" />
            </div>
            {/* 名字 */}
            <H3Secondary className="flex-grow-1">{name}</H3Secondary>
            {/* icon */}
            <ChevronRightIcon size={40} />
            <Link
              to="/account/profile"
              className="stretched-link"
              onClick={closeMenu}
              title="前往會員中心"
            />
          </div>
        </section>
      )}
      {/* modal-body */}
      <main className="mobile-menu-body py-4 px-8">
        <MobileSearchbar isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
      </main>
    </section>
  );
}

FullscreenMenu.propTypes = {
  isMenuOpen: bool.isRequired,
  closeMenu: func.isRequired,
  path: string.isRequired,
};

export default FullscreenMenu;
