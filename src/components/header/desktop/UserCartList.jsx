import { useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

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
  const { data: getCartResponse, isLoading: isGettingCart } = useGetCartQuery(userId);
  console.log({ getCartResponse });

  const { items: cartItems = [], amount: total = 0 } = useMemo(
    () => getCartResponse?.data ?? {},
    [getCartResponse]
  );
  // console.log({ cartItems }, { total });

  // const [
  //   triggerGetCart,
  //   { data: getCartResponse, isLoading: isGettingCart, isSuccess: hasCartGotten },
  // ] = useLazyGetCartQuery();

  // const { items: cartItems = [], amount: total = 0 } = useMemo(
  //   () => getCartResponse?.data ?? {},
  //   [getCartResponse]
  // );
  // console.log({ cartItems }, { total });

  const handleCartEnter = useCallback(async () => {
    clearTimeout(hoverTimeout.current);

    // try {
    //   await triggerGetCart(userId).unwrap();
    // } catch (error) {
    //   console.error(error);
    // }

    open();
  }, [open]);

  const handleCartLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => {
      close();
    }, 150);
  }, [close]);

  // const handleCartLeave = () => {
  //   hoverTimeout.current = setTimeout(() => {
  //     wrapperRef.current?.classList.remove("show");
  //   }, 50);
  // };

  return (
    <section
      className={`dropdown position-relative ${isOpen ? "show" : ""}`}
      ref={triggerRef}
      onMouseEnter={handleCartEnter}
      onMouseLeave={handleCartLeave}
    >
      {/* 觸發按鈕 */}
      <TextMedium as="a" role="button" className="p-3" aria-expanded="false">
        <CartIcon title="查看購物車" />
      </TextMedium>

      {/* 下拉選單 */}
      {isOpen && (
        <section
          ref={dropdownRef}
          className="dropdown-menu dropdown-wrapper dropdown-content mt-3"
          style={{ ...position }}
        >
          <main className="d-flex flex-column gap-3">
            <TextMedium as="p" className="border-bottom border-gray-200 pb-2 mb-1">
              購物車
            </TextMedium>

            {!userId ? (
              <section className="d-flex align-items-center justify-content-center py-8">
                <BtnPrimary as={Link} to="/login">
                  請先登入
                </BtnPrimary>
              </section>
            ) : isGettingCart ? (
              <section className="d-flex justify-content-center py-10">
                <TextMedium as="p">載入中...</TextMedium>
              </section>
            ) : cartItems.length === 0 ? (
              <section className="d-flex justify-content-center py-10">
                <TextMedium as="p">購物車空空如也……</TextMedium>
              </section>
            ) : (
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
                      <CartItem
                        key={item.id}
                        item={item}
                        // checked={selectedIds.includes(item.id)}
                        // onCheckChange={handleCheckboxChange}
                        // onDelete={handleDelete}
                        // isDeleting={deletingId === item.id}
                      />
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
            )}
          </main>
        </section>
      )}
    </section>
  );
}

export default UserCartList;
