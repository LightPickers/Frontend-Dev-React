import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { TextMedium } from "@components/TextTypography";
import { BtnPrimary } from "@components/Buttons";
import { SearchIcon } from "@components/icons";
import UserWishlist from "@components/header/desktop/UserWishlist";
import UserCartList from "@components/header/desktop/UserCartList";

function UserMenu() {
  const user = useSelector(state => state.auth.user);
  const APP_BASE = import.meta.env.VITE_APP_BASE;

  return (
    <div className="d-flex align-items-center gap-7">
      <div className="d-flex align-items-center gap-3">
        <TextMedium as={Link} className="p-3">
          <SearchIcon title="搜尋商品" />
        </TextMedium>

        <UserWishlist user={user} />

        <UserCartList />
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

export default UserMenu;
