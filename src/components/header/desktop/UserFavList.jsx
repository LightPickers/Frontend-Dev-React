import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";

import {
  useDeleteWishlistProductMutation,
  useGetWishlistProductsQuery,
} from "@features/wishlist/wishlistApi";
import useDecodedId from "@hooks/useDecodedId";
import { useDropdownPosition } from "@hooks/useDropdownPosition";
import { TextMedium, TextSmall } from "@components/TextTypography";
import { FavoriteIcon } from "@components/icons";
import { BtnPrimary } from "@components/Buttons";
import FavItem from "@components/header/desktop/FavItem";
import { formatPrice } from "@utils/formatPrice";
import { ConfirmDialogue, ErrorAlert } from "@/components/Alerts";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import store from "@/store";
import { cartApi } from "@/features/cart/cartApi";

function UserFavList() {
  const [selectedFavIds, setSelectedFavIds] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const hasSelected = selectedProducts.length > 0;
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const label = hasSelected ? `加入購物車 (${selectedProducts.length})` : "加入購物車";

  const navigate = useNavigate();
  // API 相關
  const userId = useDecodedId();
  const {
    data: wishlistResponse,
    isLoading,
    refetch: reFetchFavlist,
  } = useGetWishlistProductsQuery(userId ? undefined : skipToken);

  // const [deleteWishlistProduct, { isLoading: isDeleting }] = useDeleteWishlistProductMutation();

  const wishlistItems = useMemo(() => wishlistResponse?.data ?? [], [wishlistResponse]);
  const totalSellingPrice = wishlistResponse?.totalSellingPrice ?? 0;

  // 下拉選單相關
  const hoverTimeout = useRef(null);
  const { triggerRef, dropdownRef, isOpen, position, open, close } = useDropdownPosition({
    placement: "bottom",
    alignment: "center",
    offset: 12,
    boundary: 20,
  });

  const handleWishlistEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    open();
  }, [open]);

  const handleWishlistLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      close();
    }, 150);
  }, [close]);

  const handleDropdownClick = useCallback(e => {
    e.stopPropagation();
  }, []);

  // 處理從子元件傳回來的資料，並設定所選的 id 陣列
  // const handleCheckboxChange = useCallback((favId, productId, name, isChecked) => {
  //   const updateSet = (prev, item) => {
  //     // 根據 isChecked（勾選狀態）判斷將 id 加入陣列或從陣列刪除
  //     // item: {id, name}
  //     return isChecked
  //       ? Array.from(new Set([...prev, item]))
  //       : prev.filter(existingItem => existingItem.id !== item.id);
  //   };
  //   setSelectedFavIds(prev => updateSet(prev, favId));
  //   setSelectedProducts(prev => updateSet(prev, { productId, name }));
  // }, []);

  const handleCheckboxChange = useCallback((favId, productId, name, isChecked) => {
    // keyName => 選擇一個 key 做為比對項目
    const updateSet = (prev, item, keyName = "id") => {
      if (isChecked) {
        // 檢查是否已存在，避免重複添加
        const exists = prev.some(existingItem => existingItem[keyName] === item[keyName]);
        return exists ? prev : [...prev, item];
      } else {
        // 移除項目
        return prev.filter(existingItem => existingItem[keyName] !== item[keyName]);
      }
    };

    setSelectedFavIds(prev => updateSet(prev, favId, "id"));
    setSelectedProducts(prev => updateSet(prev, { productId, name }, "productId"));
  }, []);

  // 加入購物車
  const handleAddToCart = useCallback(async () => {
    setIsAddingToCart(true);
    const successProducts = [];
    const failedProducts = [];
    try {
      // 用 for...of... 迴圈打 API
      for (const { productId, name } of selectedProducts) {
        try {
          await store.dispatch(cartApi.endpoints.addToCart.initiate(productId)).unwrap();
          successProducts.push({ productId, name });
        } catch (error) {
          console.error(`${name} 加入購物車失敗`, error);
          failedProducts.push({ productId, name, error });
        }
      }
      // 有錯誤的話，組合錯誤訊息
      if (failedProducts.length > 0) {
        const failedCauses = failedProducts
          .map(product => {
            const { name, error } = product;
            const message = getApiErrorMessage(error);
            return `${name}(${message})`;
          })
          .join("、");
        ErrorAlert({ title: "以下商品加入失敗：", text: `${failedCauses}` });
      }
      if (successProducts.length > 0) {
        const successfullyAddedCart = successProducts
          .map(product => `「${product.name}」`)
          .join("、");
        ConfirmDialogue({
          title: "成功加入購物車",
          icon: "success",
          text: `已成功將 ${successfullyAddedCart} 加入購物車，是否前去查看？`,
          action: () => {
            navigate("/cart");
          },
        });
        setSelectedProducts([]);
        reFetchFavlist();
      }
    } finally {
      setIsAddingToCart(false);
      setSelectedProducts([]);
      reFetchFavlist();
    }
  }, [selectedProducts, navigate, reFetchFavlist]);

  // 主要內容的渲染
  const renderDropdownContent = () => {
    // 尚未登入
    if (!userId) {
      return (
        <section className="d-flex align-items-center justify-content-center py-10">
          <BtnPrimary as={Link} to="/login">
            請先登入
          </BtnPrimary>
        </section>
      );
    }
    // 載入中
    if (isLoading) {
      return (
        <section className="d-flex justify-content-center py-10">
          <TextMedium as="p">載入中...</TextMedium>
        </section>
      );
    }
    // 尚未收藏商品
    if (wishlistItems.length === 0) {
      return (
        <section className="d-flex justify-content-center py-10">
          <TextMedium as="p">您尚未收藏商品</TextMedium>
        </section>
      );
    }
    return (
      <section className="d-flex flex-column gap-4">
        <div
          className="dropdown-scroll-container"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          <ul className="ps-0 d-flex flex-column gap-2 mb-0">
            {wishlistItems.map(item => {
              return <FavItem key={item.id} item={item} onCheckChange={handleCheckboxChange} />;
            })}
          </ul>
        </div>

        <TextMedium
          as="p"
          className="border-top border-gray-200 pt-3 d-flex align-items-end justify-content-end gap-1 mb-0"
        >
          <TextSmall>NT$</TextSmall> {formatPrice(totalSellingPrice, false)}
        </TextMedium>

        <BtnPrimary
          type="button"
          className="w-100"
          onClick={handleAddToCart}
          disabled={!hasSelected || isAddingToCart}
        >
          {!isAddingToCart ? `${label}` : "加入購物車中…"}
        </BtnPrimary>
      </section>
    );
  };

  return (
    <section
      className={classNames("dropdown", "position-relative", {
        show: isOpen,
      })}
      ref={triggerRef}
      onMouseEnter={handleWishlistEnter}
      onMouseLeave={handleWishlistLeave}
    >
      <TextMedium
        as="a"
        role="button"
        //p-xl-3 p-lg-2
        className="p-3 d-flex justify-content-center align-items-center"
      >
        <FavoriteIcon title="查看收藏清單" />
      </TextMedium>
      {isOpen && (
        <main
          ref={dropdownRef}
          className="dropdown-menu dropdown-wrapper dropdown-content mt-3"
          style={position}
          onClick={handleDropdownClick}
        >
          <main className="d-flex flex-column gap-3">
            <TextMedium as="p" className="border-bottom border-gray-200 pb-2 mb-1">
              收藏列表
            </TextMedium>
            {renderDropdownContent()}
          </main>
        </main>
      )}
    </section>
  );
}

export default UserFavList;
