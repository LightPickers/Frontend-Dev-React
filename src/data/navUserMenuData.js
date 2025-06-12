import logoutAndRedirect from "@features/auth/logoutAndRedirect";

function getUserMenu({ dispatch, navigate }) {
  return [
    {
      label: "我的帳戶",
      role: "link",
      path: "/account/profile",
    },
    // {
    //   label: "專屬優惠券",
    //   role: "link",
    //   path: "/account/profile",
    // },
    {
      label: "訂單查詢",
      role: "link",
      path: "/account/profile/orders",
    },
    {
      label: "收藏清單",
      role: "link",
      path: "/account/profile/wishlists",
    },
    {
      label: "會員登出",
      role: "button",
      func: () => logoutAndRedirect({ dispatch, navigate }),
    },
  ];
}

export default getUserMenu;
