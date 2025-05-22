import { useRef, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

function UserWishlist({ user }) {
  const hoverTimeout = useRef(null);

  const { data, isLoading } = useGetWishlistProductsQuery();
  const [deleteWishlistProduct] = useDeleteWishlistProductMutation();

  // 使用 dropdown position hook
  const { triggerRef, dropdownRef, isOpen, position, open, close } = useDropdownPosition({
    placement: "bottom",
    alignment: "end", // 右對齊，因為通常在 header 右側
    offset: 12,
    boundary: 20,
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const wishlistItems = useMemo(() => data?.data ?? [], [data]);
  const totalSellingPrice = data?.totalSellingPrice ?? 0;

  const handleWishlistEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    open();
  }, [open]);

  const handleWishlistLeave = useCallback(() => {
    // 如果正在刪除，就不要關閉
    if (deletingId) {
      return;
    }

    hoverTimeout.current = setTimeout(() => {
      if (!deletingId) {
        close();
      }
    }, 150);
  }, [close, deletingId]);

  const handleCheckboxChange = useCallback((wishItemId, productId, checked) => {
    setSelectedIds(prev =>
      checked
        ? Array.from(new Set([...prev, wishItemId]))
        : prev.filter(itemId => itemId !== wishItemId)
    );
    setSelectedProductIds(prev =>
      checked
        ? Array.from(new Set([...prev, productId]))
        : prev.filter(wishProductId => wishProductId !== productId)
    );
  }, []);

  const handleDelete = useCallback(
    async id => {
      try {
        setDeletingId(id);
        open(); // 確保 dropdown 保持開啟
        clearTimeout(hoverTimeout.current);

        await deleteWishlistProduct(id).unwrap();
        toast.success("刪除成功");
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      } finally {
        setTimeout(() => {
          setDeletingId(null);
          // close();
        }, 200);
      }
    },
    [deleteWishlistProduct, open]
  );

  const handleAddToCart = useCallback(async () => {
    try {
      const promises = selectedProductIds.map(id => {
        return store.dispatch(cartApi.endpoints.addToCart.initiate(id)).unwrap();
      });
      await Promise.all(promises);
      toast.success("加入購物車成功");
    } catch (errorWhenAddingToCart) {
      toast.error(getApiErrorMessage(errorWhenAddingToCart, "加入購物車失敗，請稍後再試"));
    }
  }, [selectedProductIds]);

  const handleDropdownClick = useCallback(e => {
    e.stopPropagation();
  }, []);

  return (
    <section
      className={`dropdown position-relative ${deletingId ? "dropdown-disabled" : ""} ${isOpen ? "show" : ""}`}
      ref={triggerRef}
      onMouseEnter={handleWishlistEnter}
      onMouseLeave={handleWishlistLeave}
    >
      {/* 觸發按鈕 */}
      <TextMedium as="a" role="button" className="p-3">
        <FavoriteIcon title="查看收藏清單" />
      </TextMedium>

      {/* 下拉選單 */}
      {isOpen && (
        <section
          ref={dropdownRef}
          className="dropdown-menu dropdown-wrapper wishlist-items"
          style={{
            ...position,
            minWidth: "320px",
            maxWidth: "400px",
            // maxHeight: "70vh",
            // overflowY: "auto",
            // boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            // border: "1px solid rgba(0, 0, 0, 0.08)",
            // opacity: isOpen ? 1 : 0,
            // transform: isOpen ? "translateY(0)" : "translateY(-10px)",
            // transition: "all 0.2s ease-in-out",
          }}
          onClick={handleDropdownClick}
        >
          <main className="d-flex flex-column gap-3">
            <TextMedium as="p" className="border-bottom border-gray-200 pb-2 mb-1">
              收藏列表
            </TextMedium>

            {!user ? (
              <section className="d-flex align-items-center justify-content-center py-8">
                <BtnPrimary as={Link} to="/login">
                  請先登入
                </BtnPrimary>
              </section>
            ) : isLoading ? (
              <section className="d-flex justify-content-center py-8">
                <TextMedium as="p">載入中...</TextMedium>
              </section>
            ) : wishlistItems.length === 0 ? (
              <section className="d-flex justify-content-center py-8">
                <TextMedium as="p">您尚未收藏商品</TextMedium>
              </section>
            ) : (
              <section className="d-flex flex-column gap-4">
                <div
                  className="wishlist-scroll-container"
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
                  disabled={selectedIds.length === 0 || deletingId}
                >
                  加入購物車 {selectedIds.length > 0 && `(${selectedIds.length})`}
                </BtnPrimary>
              </section>
            )}
          </main>
        </section>
      )}
    </section>
  );
}

UserWishlist.propTypes = {
  user: PropTypes.any,
};

export default UserWishlist;
