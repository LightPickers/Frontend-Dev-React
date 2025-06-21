import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { ConfirmDialogue } from "@/components/Alerts";

function useRequireAuth() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  return function (onAuthenticated) {
    if (isAuthenticated) {
      onAuthenticated?.();
    } else {
      const action = () => {
        navigate("/login", { state: { from: location } });
        // navigate("/login", { state: { from: location.pathname } });
      };
      ConfirmDialogue({ title: "前往登入？", text: "您必須登入才能執行此動作", action });
    }
  };
}

export default useRequireAuth;
