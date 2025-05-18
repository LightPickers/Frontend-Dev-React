import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function useRequireAuth() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  return function (onAuthenticated) {
    if (isAuthenticated) {
      onAuthenticated?.();
    } else {
      navigate("/login", { state: { from: location.pathname } });
    }
  };
}

export default useRequireAuth;
