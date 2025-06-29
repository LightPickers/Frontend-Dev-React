import { useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";

import { CartIcon } from "@components/icons";
import { TextMedium, TextSmall } from "@components/TextTypography";
import useDecodedId from "@hooks/useDecodedId";
import { useDropdownPosition } from "@hooks/useDropdownPosition";
import { useGetCartQuery } from "@features/cart/cartApi";
import CartItem from "@components/header/desktop/CartItem";
import { formatPrice } from "@utils/formatPrice";
import { BtnPrimary } from "@components/Buttons";

function UserCartList() {
  const hoverTimeout = useRef(null);
  const { triggerRef, dropdownRef, isOpen, position, open, close } = useDropdownPosition({
    placement: "bottom",
    alignment: "center",
    offset: 12,
    boundary: 20,
  });

  const userId = useDecodedId();

  const { data: getCartResponse, isLoading: isGettingCart } = useGetCartQuery(
    userId ? userId : skipToken
  );
  const { items: cartItems = [], amount: total = 0 } = useMemo(
    () => getCartResponse?.data ?? {},
    [getCartResponse]
  );

  const hasCartItems = cartItems.length > 0;

  const handleCartEnter = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    open();
  }, [open]);

  const handleCartLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      close();
    }, 150);
  }, [close]);

  const handleDropdownClick = useCallback(e => {
    e.stopPropagation();
  }, []);

  // 抽取內容渲染邏輯
  const renderDropdownContent = () => {
    if (!userId) {
      return (
        <section className="d-flex align-items-center justify-content-center py-8">
          <BtnPrimary as={Link} to="/login">
            請先登入
          </BtnPrimary>
        </section>
      );
    }

    if (isGettingCart) {
      return (
        <section className="d-flex justify-content-center py-10">
          <TextMedium as="p">載入中...</TextMedium>
        </section>
      );
    }

    if (!hasCartItems) {
      return (
        <section className="d-flex justify-content-center py-10">
          <TextMedium as="p">購物車還沒有商品唷</TextMedium>
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
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
        </div>

        <TextMedium
          as="p"
          className="border-top border-gray-200 pt-3 d-flex align-items-end justify-content-end gap-1 mb-0"
        >
          <TextSmall>NT$</TextSmall> {formatPrice(total, false)}
        </TextMedium>

        <BtnPrimary as={Link} to="/cart" type="button" className="text-center w-100">
          前往結帳
        </BtnPrimary>
      </section>
    );
  };

  return (
    <section
      className={`dropdown position-relative ${isOpen ? "show" : ""}`}
      ref={triggerRef}
      onMouseEnter={handleCartEnter}
      onMouseLeave={handleCartLeave}
    >
      <TextMedium
        as="a"
        role="button"
        //p-xl-3 p-lg-2
        className="p-3 d-flex justify-content-center align-items-center"
        aria-expanded="false"
      >
        <CartIcon title="查看購物車" />
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
              購物車
            </TextMedium>
            {renderDropdownContent()}
          </main>
        </section>
      )}
    </section>
  );
}

export default UserCartList;
