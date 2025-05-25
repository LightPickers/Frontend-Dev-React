// hooks/useCartInitialization.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useGetCartQuery } from "@features/cart/cartApi";
import { setProductIds, selectCartProductIds } from "@features/cart/cartSlice";

/**
 * 初始化購物車狀態的 Hook
 * 在應用啟動時獲取購物車數據並同步到 Redux
 */
export const useCartInitialization = () => {
  const dispatch = useDispatch();
  const cartProductIds = useSelector(selectCartProductIds);

  // 獲取購物車數據
  const { data: cartData, isLoading, isSuccess, isError } = useGetCartQuery();

  // 當購物車數據獲取成功時，同步到 Redux
  useEffect(() => {
    if (isSuccess && cartData?.data?.items) {
      const productIds = cartData.data.items.map(item => item.product_id).filter(id => id);

      // 只有當 productIds 確實改變時才更新
      const currentIds = Array.from(cartProductIds).sort();
      const newIds = productIds.sort();

      if (JSON.stringify(currentIds) !== JSON.stringify(newIds)) {
        dispatch(setProductIds(productIds));
      }
    }
  }, [isSuccess, cartData, cartProductIds, dispatch]);

  return {
    isLoading,
    isError,
    cartData,
    cartProductIds,
  };
};

// 在 App.js 或根組件中使用
// export default function App() {
//   const { isLoading } = useCartInitialization();
//
//   if (isLoading) {
//     return <div>載入中...</div>;
//   }
//
//   return (
//     <Router>
//       {/* 你的應用內容 */}
//     </Router>
//   );
// }
