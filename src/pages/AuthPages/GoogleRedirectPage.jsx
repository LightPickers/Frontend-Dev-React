import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "@features/auth/authSlice";

function GoogleRedirectPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");

    if (token) {
      localStorage.setItem("token", token);
      dispatch(setCredentials({ token, user: { name } }));
      navigate("/");
    } else {
      toast.error("Google 登入失敗");
      navigate("/login");
    }
  }, [dispatch, navigate, location.search]);

  return <p>登入中，請稍候...</p>;
}

export default GoogleRedirectPage;
