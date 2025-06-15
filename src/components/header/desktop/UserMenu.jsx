import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import NavSearchBar from "@components/header/desktop/NavSearchBar";
import UserWishlist from "@components/header/desktop/UserWishlist";
import UserCartList from "@components/header/desktop/UserCartList";
import UserAvatar from "@components/header/desktop/UserAvatar";
import { BtnPrimary } from "@components/Buttons";
import UserFavList from "@/components/header/desktop/UserFavList";
// gap-xl-7 gap-lg-5
// gap-xl-3 gap-lg-2
function UserMenu() {
  const user = useSelector(state => state.auth.user);

  return (
    <div className="d-flex align-items-center ms-auto gap-7">
      <div className="d-flex align-items-center gap-3">
        <NavSearchBar />

        <UserWishlist />
        {/* <UserFavList /> */}

        <UserCartList />
      </div>

      {user ? (
        <UserAvatar user={user} />
      ) : (
        <>
          <BtnPrimary as={Link} to="/login" className="d-xl-block d-none">
            註冊∕登入
          </BtnPrimary>
          <BtnPrimary size="small" as={Link} to="/login" className="d-xl-none d-lg-block">
            登入
          </BtnPrimary>
          {/* 1056 medium */}
          {/* 1017 small */}
        </>
      )}
    </div>
  );
}

export default UserMenu;
