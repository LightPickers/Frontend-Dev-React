import { object } from "prop-types";
import { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useDropdownPosition } from "@hooks/useDropdownPosition";
import { TextLarge, TextMedium } from "@components/TextTypography";
import getUserMenu from "@data/navUserMenuData";

function UserAvatar({ user }) {
  const { photo, name } = user;
  const APP_BASE = import.meta.env.VITE_APP_BASE;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserMenu = getUserMenu({ dispatch, navigate }); // 下拉選單內容
  // 下拉選單
  const hoverTimeout = useRef(null);
  const { triggerRef, dropdownRef, isOpen, position, open, close } = useDropdownPosition({
    placement: "bottom",
    alignment: "center",
    offset: 12,
    boundary: 20,
  });

  const handleEnterUserMenu = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    open();
  }, [open]);

  const handleLeaveUserMenu = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      close();
    }, 150);
  }, [close]);

  return (
    <section
      className={`dropdown position-relative ${isOpen ? "show" : ""}`}
      ref={triggerRef}
      onMouseEnter={handleEnterUserMenu}
      onMouseLeave={handleLeaveUserMenu}
    >
      {/* 導覽列按鈕 */}
      <a role="button" className="user-avatar" aria-expanded="false">
        <img src={photo || `${APP_BASE}icon/default_avatar.svg`} alt={name} />
      </a>

      {/* 下拉選單 */}
      {isOpen && (
        <section
          ref={dropdownRef}
          className="dropdown-menu nav-avatar-dropdown dropdown-content mt-3"
          style={position}
        >
          <main className="d-flex flex-column">
            <div className="dropdown-header d-flex gap-3">
              <TextLarge>Hi!</TextLarge>
              <TextLarge>{name}</TextLarge>
            </div>
            <ul className="dropdown-body">
              {UserMenu.map(item => {
                const { label, role, path, func } = item;
                return (
                  <li key={label} className="py-1 px-2">
                    {role === "link" && (
                      <TextMedium as={Link} to={path}>
                        {label}
                      </TextMedium>
                    )}
                    {role === "button" && (
                      <TextMedium
                        as="button"
                        onClick={func}
                        className="btn btn-link p-0 shadow-none"
                      >
                        {label}
                      </TextMedium>
                    )}
                  </li>
                );
              })}
            </ul>
          </main>
        </section>
      )}
    </section>
  );
}

UserAvatar.propTypes = {
  user: object.isRequired,
};

export default UserAvatar;
