import classNames from "classnames";
import { bool, func, string } from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ChevronRightIcon, CloseIcon } from "@components/icons";
import { H3Secondary } from "@components/Headings";
import MobileSearchbar from "@components/header/mobile/MobileSearchbar";
import MobileNavItems from "@components/header/mobile/MobileNavItems";
import { BtnPrimary } from "@components/Buttons";
import logoutAndRedirect from "@features/auth/logoutAndRedirect";
import useBodyScrollLock from "@hooks/useBodyScrollLock";
import { useGetUserProfileQuery } from "@features/users/userApi";

function FullscreenMenu({ isMenuOpen, closeMenu, path }) {
  const user = useSelector(state => state.auth.user);
  const { data: getUserResponse } = useGetUserProfileQuery(undefined, {
    skip: !user,
  });

  const { name = "", photo = "" } = getUserResponse?.data?.user ?? {};
  const defaultPhoto = `${path}icon/default_avatar.svg`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useBodyScrollLock(isMenuOpen);

  return (
    <section
      className={classNames("fullscreen-menu", "d-lg-none", "d-block", {
        active: isMenuOpen,
        "pointer-events-none": !isMenuOpen,
      })}
    >
      {/* modal-header */}
      <section className="py-sm-5 py-2 px-sm-2 px-3">
        <div className="container-fluid mobile-menu-header">
          <Link className="navbar-brand" to="/" onClick={closeMenu}>
            <img src={`${path}Logo.svg`} alt="拾光堂 logo" />
          </Link>
          <button className="btn btn-link p-0 text-gray-500" type="button" onClick={closeMenu}>
            <CloseIcon size={48} strokeWidth={1.5} />
          </button>
        </div>
      </section>
      {/* modal-body */}
      {user && (
        // px-sm-4  gap-4
        <section className="user-section py-3">
          <div className="user-wrapper gap-4 gap-sm-6 px-8 px-sm-12">
            {/* 頭像 */}
            <div className="avatar-container">
              <img
                src={photo || defaultPhoto}
                alt={name}
                className="object-fit-cover w-100 h-100"
              />
            </div>
            {/* 名字 */}
            <H3Secondary className="flex-grow-1">{name}</H3Secondary>
            {/* icon */}
            <ChevronRightIcon size={40} />
            <Link
              to="/account/profile/settings"
              className="stretched-link"
              onClick={closeMenu}
              title="前往會員中心"
            />
          </div>
        </section>
      )}
      <div className="d-flex flex-column h-auto py-4 px-8 gap-5">
        {/* modal-body */}
        <main className="mobile-menu-body">
          <div className="d-flex flex-column gap-md-6 gap-5">
            <MobileSearchbar isMenuOpen={isMenuOpen} closeMenu={closeMenu} />
            <MobileNavItems closeMenu={closeMenu} />
          </div>
        </main>
        {!user ? (
          <section className="mobile-menu-footer mt-auto w-100">
            <BtnPrimary
              className="text-center w-100 d-block"
              as={Link}
              to="/login"
              onClick={closeMenu}
            >
              註冊∕登入
            </BtnPrimary>
          </section>
        ) : (
          <section className="mobile-menu-footer mt-auto w-100">
            <BtnPrimary
              className="text-center w-100 "
              onClick={() => {
                logoutAndRedirect({ dispatch, navigate });
              }}
            >
              會員登出
            </BtnPrimary>
          </section>
        )}
      </div>
    </section>
  );
}

FullscreenMenu.propTypes = {
  isMenuOpen: bool.isRequired,
  closeMenu: func.isRequired,
  path: string.isRequired,
};

export default FullscreenMenu;
