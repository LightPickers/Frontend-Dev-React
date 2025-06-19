function getBannerCarouselPics() {
  const APP_BASE = import.meta.env.VITE_APP_BASE;
  const PIC_PATH = `${APP_BASE}homepage/banner`;
  return [
    {
      id: 1,
      images: {
        forLargeScreen: `${PIC_PATH}/banner-1-lg.png`,
        forSmallScreen: `${PIC_PATH}/banner-1-sm.png`,
      },
      element: { title: "探詢菲林，尋覓光影", type: "search", text: "找尋商品…" },
    },
    {
      id: 2,
      images: {
        forLargeScreen: `${PIC_PATH}/banner-2-lg.png`,
        forSmallScreen: `${PIC_PATH}/banner-2-sm.png`,
      },
      element: { title: "你的珍藏，能是別人的靈光", type: "button", text: "瀏覽商品" },
      // element: { title: "你的珍藏，能是別人的靈光", type: "button", text: "成為賣家" },
    },
    {
      id: 3,
      images: {
        forLargeScreen: `${PIC_PATH}/banner-3-lg.png`,
        forSmallScreen: `${PIC_PATH}/banner-3-sm.png`,
      },
      element: { title: "探詢菲林，尋覓光影", type: "search", text: "找尋商品…" },
    },
    {
      id: 4,
      images: {
        forLargeScreen: `${PIC_PATH}/banner-4-lg.png`,
        forSmallScreen: `${PIC_PATH}/banner-4-sm.png`,
      },
      element: { title: "你的珍藏，能是別人的靈光", type: "button", text: "瀏覽商品" },
      // element: { title: "你的珍藏，能是別人的靈光", type: "button", text: "成為賣家" },
    },
  ];
}

export default getBannerCarouselPics;
