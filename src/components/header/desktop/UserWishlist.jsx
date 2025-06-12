import { useRef, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { skipToken } from "@reduxjs/toolkit/query";

import store from "@/store";
import { FavoriteIcon } from "@components/icons";
import { TextMedium, TextSmall } from "@components/TextTypography";
import { BtnPrimary } from "@components/Buttons";
import { formatPrice } from "@utils/formatPrice";
import {
  useGetWishlistProductsQuery,
  useDeleteWishlistProductMutation,
} from "@features/wishlist/wishlistApi";
import { cartApi } from "@features/cart/cartApi";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";
import WishlistItem from "@components/header/desktop/WishlistItem";
import { useDropdownPosition } from "@hooks/useDropdownPosition";
import useDecodedId from "@hooks/useDecodedId";

function UserWishlist() {
  const hoverTimeout = useRef(null);
  const userId = useDecodedId();
  const {
    data,
    isLoading,
    refetch: reFetchWishlist,
  } = useGetWishlistProductsQuery(userId ? undefined : skipToken);
  const [deleteWishlistProduct] = useDeleteWishlistProductMutation();
  // console.log({ data });

  const { triggerRef, dropdownRef, isOpen, position, open, close } = useDropdownPosition({
    placement: "bottom",
    alignment: "center",
    offset: 12,
    boundary: 20,
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCartProductIds, setAddedToCartProductIds] = useState(new Set());

  const wishlistItems = useMemo(() => data?.data ?? [], [data]);
  // console.log({ wishlistItems });
  const totalSellingPrice = data?.totalSellingPrice ?? 0;
  const hasSelectedItems = selectedIds.length > 0;
  const isProcessing = deletingId || isAddingToCart;

  const handleWishlistEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    open();
  }, [open]);

  const handleWishlistLeave = useCallback(() => {
    if (deletingId) return;

    hoverTimeout.current = setTimeout(() => {
      if (!deletingId) close();
    }, 150);
  }, [close, deletingId]);

  const handleCheckboxChange = useCallback(
    (wishItemId, productId, checked) => {
      if (addedToCartProductIds.has(productId)) return;

      const updateSet = (prev, id) =>
        checked ? Array.from(new Set([...prev, id])) : prev.filter(existingId => existingId !== id);

      setSelectedIds(prev => updateSet(prev, wishItemId));
      setSelectedProductIds(prev => updateSet(prev, productId));
    },
    [addedToCartProductIds]
  );

  const handleDelete = useCallback(
    async id => {
      try {
        setDeletingId(id);
        open();
        clearTimeout(hoverTimeout.current);

        await deleteWishlistProduct(id).unwrap();
        toast.success("刪除成功");
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setTimeout(() => setDeletingId(null), 200);
      }
    },
    [deleteWishlistProduct, open]
  );

  const handleAddToCart = useCallback(async () => {
    try {
      setIsAddingToCart(true);
      const addingRequests = selectedProductIds.map(id =>
        store.dispatch(cartApi.endpoints.addToCart.initiate(id)).unwrap()
      );

      await Promise.all(addingRequests);

      // 標記這些商品已經加入購物車
      setAddedToCartProductIds(prev => new Set([...prev, ...selectedProductIds]));

      // 取消選擇已加入購物車的商品
      setSelectedIds(prev =>
        prev.filter(id => {
          const item = wishlistItems.find(item => item.id === id);
          return !selectedProductIds.includes(item?.productId);
        })
      );
      setSelectedProductIds([]);

      toast.success("加入購物車成功");
      reFetchWishlist();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "加入購物車失敗，請稍後再試"));
    } finally {
      setIsAddingToCart(false);
    }
  }, [selectedProductIds, wishlistItems, reFetchWishlist]);

  const handleDropdownClick = useCallback(e => {
    e.stopPropagation();
  }, []);

  const renderDropdownContent = () => {
    if (!userId) {
      return (
        <section className="d-flex align-items-center justify-content-center py-10">
          <BtnPrimary as={Link} to="/login">
            請先登入
          </BtnPrimary>
        </section>
      );
    }

    if (isLoading) {
      return (
        <section className="d-flex justify-content-center py-10">
          <TextMedium as="p">載入中...</TextMedium>
        </section>
      );
    }

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
            {wishlistItems.map(item => (
              <WishlistItem
                key={item.id}
                item={item}
                checked={selectedIds.includes(item.id)}
                onCheckChange={handleCheckboxChange}
                onDelete={handleDelete}
                isDeleting={deletingId === item.id}
                isAddedToCart={addedToCartProductIds.has(item.productId)}
                isCheckboxDisabled={addedToCartProductIds.has(item.productId)}
              />
            ))}
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
          disabled={!hasSelectedItems || isProcessing}
        >
          加入購物車 {hasSelectedItems && `(${selectedIds.length})`}
        </BtnPrimary>
      </section>
    );
  };

  return (
    <section
      className={`dropdown position-relative ${deletingId ? "dropdown-disabled" : ""} ${isOpen ? "show" : ""}`}
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
        <section
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
        </section>
      )}
    </section>
  );
}

export default UserWishlist;
