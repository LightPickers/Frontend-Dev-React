import { useRef } from "react";

import { CartIcon } from "@components/icons";
import { TextMedium } from "@components/TextTypography";

function UserCartList() {
  const wrapperRef = useRef(null);
  const hoverTimeout = useRef(null);

  // 展開時，清除 timeout
  const handleCartEnter = () => {
    clearTimeout(hoverTimeout.current);
    wrapperRef.current?.classList.add("show");
  };
  // 關閉時，延遲一點時間關閉
  const handleCartLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      wrapperRef.current?.classList.remove("show");
    }, 50);
  };

  return (
    <section
      className="dropdown"
      ref={wrapperRef}
      onMouseEnter={handleCartEnter}
      onMouseLeave={handleCartLeave}
    >
      {/* 觸發按鈕 */}
      <TextMedium as="a" role="button" className="p-3" aria-expanded="false">
        <CartIcon title="查看購物車" />
      </TextMedium>
      {/* 下拉選單 */}
      <main className="dropdown-menu dropdown-wrapper mt-5">
        {/* 標題 */}
        <div className="d-flex flex-column gap-5">
          <TextMedium as="p" className="border-bottom border-gray-200 pb-1">
            購物車
          </TextMedium>
        </div>
        {/* 內容 */}
      </main>
    </section>
  );
}

export default UserCartList;
