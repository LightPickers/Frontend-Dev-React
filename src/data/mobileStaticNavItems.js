function getStaticMobileNavData() {
  return [
    {
      name: "購物車",
      path: "/cart",
      hasChild: false,
    },
    {
      name: "願望清單",
      path: "/account/profile/wishlists",
      hasChild: false,
    },
    {
      name: "訂單管理",
      path: "/account/profile/orders",
      hasChild: false,
    },
  ];
}

export default getStaticMobileNavData;
