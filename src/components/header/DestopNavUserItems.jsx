import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Dropdown } from "bootstrap";

import { TextMedium } from "@components/TextTypography";
import { BtnPrimary } from "@components/Buttons";
import { SearchIcon, CartIcon } from "@components/icons";
import DesktopNavWishlist from "@components/header/DesktopNavWishlist";

function DesktopNavUserItems() {
  const user = useSelector(state => state.auth.user);
  const APP_BASE = import.meta.env.VITE_APP_BASE;

  const cartListRef = useRef(null);
  const cartDropdown = useRef(null);

  // 初始化 dropdown 實例
  useEffect(() => {
    if (cartListRef.current) {
      cartDropdown.current = Dropdown.getOrCreateInstance(cartListRef.current);
    }
  }, []);

  // React 事件處理函式

  const handleCartEnter = () => cartDropdown.current?.show();
  const handleCartLeave = () => cartDropdown.current?.hide();

  return (
    <div className="d-flex align-items-center gap-7">
      <div className="d-flex align-items-center gap-3">
        <TextMedium as={Link} className="p-3">
          <SearchIcon title="搜尋商品" />
        </TextMedium>

        <DesktopNavWishlist user={user} />

        <div className="dropdown p-3">
          <TextMedium
            as="a"
            ref={cartListRef}
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onMouseEnter={handleCartEnter}
            onMouseLeave={handleCartLeave}
          >
            <CartIcon title="查看購物車" />
          </TextMedium>
          <div className="dropdown-menu dropdown-wrapper">
            <p>購物車清單</p>
          </div>
        </div>
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
  );
}

export default DesktopNavUserItems;
