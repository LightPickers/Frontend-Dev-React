import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useMemo, useRef } from "react";

import {
  useDeleteWishlistProductMutation,
  useGetWishlistProductsQuery,
} from "@/features/wishlist/wishlistApi";
import useDecodedId from "@/hooks/useDecodedId";
import { useDropdownPosition } from "@/hooks/useDropdownPosition";
import { TextMedium } from "@/components/TextTypography";
import { FavoriteIcon } from "@/components/icons";

function UserFavList() {
  // API 相關
  const userId = useDecodedId();
  const {
    data: wishlistResponse,
    isLoading,
    refetch: reFetchWishlist,
  } = useGetWishlistProductsQuery(userId ? undefined : skipToken);
  const [deleteWishlistProduct] = useDeleteWishlistProductMutation();

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

  return (
    <section
      className={`dropdown position-relative ${isOpen ? "show" : ""}`}
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
          </main>
        </main>
      )}
    </section>
  );
}

export default UserFavList;
