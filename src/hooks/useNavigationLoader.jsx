// hooks/useNavigationLoader.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { showLoading, hideLoading } from "@/features/loading/loadingSlice";

export const useNavigationLoader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigateWithLoader = async (path, options = {}) => {
    const {
      text = "頁面跳轉中...",
      type = "navigation",
      minDelay = 300,
      preloadData = null,
      replace = false,
    } = options;

    try {
      // 顯示 loading
      dispatch(showLoading({ text, type }));

      // 準備 promises
      const promises = [new Promise(resolve => setTimeout(resolve, minDelay))];

      // 如果需要預載入 => 放入 promises 中
      if (preloadData && typeof preloadData === "function") {
        promises.push(preloadData());
      }

      await Promise.all(promises);

      // 執行導航
      if (replace) {
        navigate(path, { replace: true });
      } else {
        navigate(path);
      }
    } catch (error) {
      console.error("導航失敗：", error);
      toast.error("頁面載入失敗，請重試");
    } finally {
      dispatch(hideLoading());
    }
  };

  const navigateWithData = async (path, dataFetcher, options = {}) => {
    const { text = "載入資料中...", type = "data-fetch" } = options;

    try {
      dispatch(showLoading({ text, type }));

      // 先載入數據
      const data = await dataFetcher();

      // 可以將資料存到 Redux 或傳遞給目標頁面
      navigate(path, { state: { data } });
    } catch (error) {
      console.error("資料載入失敗", error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return {
    navigateWithLoader,
    navigateWithData,
  };
};
