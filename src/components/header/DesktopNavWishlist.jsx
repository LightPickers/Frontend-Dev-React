import { Dropdown } from "bootstrap";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { FavoriteIcon, CloseIcon } from "@components/icons";
import { TextMedium, TextSmall } from "@components/TextTypography";
import { H6Secondary } from "@components/Headings";
import { BtnPrimary } from "@components/Buttons";
import { formatPrice } from "@utils/formatPrice";
import {
  useGetWishlistProductsQuery,
  useDeleteWishlistProductMutation,
} from "@features/wishlist/wishlistApi";
import { useAddToCartMutation } from "@features/cart/cartApi";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

function WishlistItem({ item, checked, onCheckChange, onDelete, isDeleting }) {
  const { id, Products } = item;
  const { id: productId, name, selling_price, primary_image } = Products || {};

  return (
    <li className="d-flex align-items-center gap-3">
      {!item ? (
        <div className="d-flex justify-content-center align-items-center py-10">
          <TextMedium as="p">載入中……</TextMedium>
        </div>
      ) : (
        <>
          <input
            type="checkbox"
            className="form-check-input"
            checked={checked}
            onChange={e => onCheckChange(id, e.target.checked)}
          />
          <img src={primary_image} alt={name} className="product-img" />
          <div className="product-info text-truncate flex-grow-1">
            <H6Secondary isBold={false} className="text-truncate">
              {name}
            </H6Secondary>
            <TextSmall>
              {typeof selling_price === "number"
                ? `NT$ ${formatPrice(selling_price, false)}`
                : "N/A"}
            </TextSmall>
          </div>
          <button
            type="button"
            className="btn btn-sm delete-btn"
            onClick={e => {
              e.stopPropagation();
              onDelete(id);
            }}
            disabled={isDeleting}
          >
            <CloseIcon size={24} className="text-danger" />
          </button>
        </>
      )}
    </li>
  );
}

WishlistItem.propTypes = {
  item: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  onCheckChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool.isRequired,
};

function DesktopNavWishlist({ user }) {
  const wishlistRef = useRef(null);
  const wishlistDropdown = useRef(null);
  const hoverTimeout = useRef(null);

  const { data, isLoading } = useGetWishlistProductsQuery();
  const [deleteWishlistProduct] = useDeleteWishlistProductMutation();
  const [addToCart] = useAddToCartMutation();

  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState();

  // console.log({ data });
  const wishlistItems = useMemo(() => {
    // console.log("原始 wishlist 資料", data?.data);
    return data?.data ?? [];
  }, [data]);
  const totalSellingPrice = data?.totalSellingPrice ?? 0;

  // 初始化 dropdown
  useEffect(() => {
    if (wishlistRef.current) {
      const instance = Dropdown.getOrCreateInstance(wishlistRef.current);
      wishlistDropdown.current = instance;
      return () => instance.dispose();
    }
  }, []);

  const handleWishlistEnter = () => {
    clearTimeout(hoverTimeout.current);
    wishlistDropdown.current?.show();
  };

  const handleWishlistLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      wishlistDropdown.current?.hide();
    }, 150);
  };

  const handleCheckboxChange = useCallback((id, checked) => {
    setSelectedIds(prev => (checked ? [...prev, id] : prev.filter(itemId => itemId !== id)));
  }, []);

  const handleDelete = useCallback(
    async id => {
      try {
        setIsDeleting(true);
        await deleteWishlistProduct(id).unwrap();
        toast.success("刪除成功");
      } catch (error) {
        // console.error("刪除收藏失敗", error);
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteWishlistProduct]
  );

  const handleAddToCart = useCallback(async () => {
    const selectedProducts = wishlistItems.filter(item => selectedIds.includes(item.id));
    try {
      await addToCart(selectedProducts).unwrap();
    } catch (error) {
      console.error("加入購物車失敗", error);
    }
  }, [wishlistItems, selectedIds, addToCart]);

  return (
    <section
      className={`dropdown ${isDeleting ? "dropdown-disabled" : ""}`}
      onMouseEnter={handleWishlistEnter}
      onMouseLeave={handleWishlistLeave}
    >
      <TextMedium
        as="a"
        role="button"
        ref={wishlistRef}
        className="p-3"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <FavoriteIcon title="查看收藏清單" />
      </TextMedium>

      <main className="dropdown-menu dropdown-wrapper wishlist-items mt-2">
        <div className="d-flex flex-column gap-5">
          <TextMedium as="p" className="border-bottom border-gray-200 pb-1">
            收藏列表
          </TextMedium>

          {!user ? (
            <main className="d-flex align-items-center justify-content-center py-10">
              <BtnPrimary as={Link} to="/login">
                請先登入
              </BtnPrimary>
            </main>
          ) : isLoading ? (
            <main className="d-flex justify-content-center py-10">
              <TextMedium as="p">載入中...</TextMedium>
            </main>
          ) : wishlistItems.length === 0 ? (
            <main className="d-flex justify-content-center py-10">
              <TextMedium as="p">您尚未收藏商品</TextMedium>
            </main>
          ) : (
            <>
              <ul className="ps-0 d-flex flex-column gap-2">
                {wishlistItems.map(item => {
                  return (
                    <WishlistItem
                      key={item.id}
                      item={item}
                      checked={selectedIds.includes(item.id)}
                      onCheckChange={handleCheckboxChange}
                      onDelete={handleDelete}
                      isDeleting={isDeleting}
                    />
                  );
                })}
              </ul>

              <TextMedium
                as="p"
                className="border-top border-gray-200 pt-1 d-flex align-items-end justify-content-end gap-1"
              >
                <TextSmall>NT$</TextSmall> {formatPrice(totalSellingPrice, false)}
              </TextMedium>

              <BtnPrimary
                type="button"
                className="w-100"
                onClick={handleAddToCart}
                disabled={selectedIds.length === 0}
              >
                加入購物車
              </BtnPrimary>
            </>
          )}
        </div>
      </main>
    </section>
  );
}

DesktopNavWishlist.propTypes = {
  user: PropTypes.any,
};

export default DesktopNavWishlist;
