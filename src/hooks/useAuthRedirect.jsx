// 登入後重定向
import { useLocation, useNavigate } from "react-router-dom";

export default function useAuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  // 把使用者原本想去的頁面存起來，若無則導向首頁
  const from = location.state?.from?.pathname || "/";

  const redirectedPage = () => {
    navigate(from, { replace: true });
  };

  return { redirectedPage, from };
}
