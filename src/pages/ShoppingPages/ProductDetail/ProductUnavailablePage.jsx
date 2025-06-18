import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { BtnPrimary } from "@components/Buttons";
// import { ConfirmDialogue } from "@components/Alerts";

const ProductUnavailablePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const handleCofirm = () => {
  //   const action = () => {
  //     navigate("/products");
  //   };
  //   ConfirmDialogue({ title: "確定跳轉？", text: "確定前往商品頁面？", action });
  // };

  const handleBackClick = () => {
    // 如果有 history state，使用 back()，否則導航到指定路徑
    if (window.history.length > 1 && location.state?.from) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const getContent = type => {
    switch (type) {
      case "discontinued":
        return {
          icon: "❌",
          title: "此商品已停售",
          subtitle: "很抱歉，此商品已不再販售",
          description: "商品已從我們的商品目錄中移除，請瀏覽其他相關商品。",
        };
      case "out-of-stock":
        return {
          icon: "📦",
          title: "商品暫時缺貨",
          subtitle: "此商品目前無庫存",
          description: "商品補貨中，您可以選擇接收到貨通知。",
        };
      case "not-found":
        return {
          icon: "🔍",
          title: "找不到此商品",
          subtitle: "您所查詢的商品可能不存在或已下架",
          description: "請檢查商品連結是否正確，或瀏覽其他商品。",
        };
      default:
        return {
          icon: "❓",
          title: "商品不可用",
          subtitle: "此商品目前無法購買",
          description: "請稍後再試或聯繫客服。",
        };
    }
  };

  const content = getContent("not-found");

  return (
    <div className="product-unavailable">
      <div className="unavailable-container">
        <div className="icon-container">{content.icon}</div>

        <h1 className="unavailable-title">{content.title}</h1>
        <p className="unavailable-subtitle">{content.subtitle}</p>
        <p className="unavailable-description">{content.description}</p>

        <div className="action-buttons">
          <BtnPrimary className="w-sm-100 w-75" onClick={handleBackClick}>
            ← 返回上頁
          </BtnPrimary>
          <BtnPrimary
            className="w-sm-100 w-75"
            onClick={() => {
              // handleCofirm();
              navigate("/products");
            }}
          >
            瀏覽商品
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

export default ProductUnavailablePage;
