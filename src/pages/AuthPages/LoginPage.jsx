import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { BtnPrimary } from "@components/Buttons";
import { useLoginUserMutation } from "@features/users/userApi";
import { loginSchema } from "@schemas/users/loginSchema";
import loginAndRedirect from "@features/auth/loginAndRedirect";
import useAuthRedirect from "@hooks/useAuthRedirect";
import RedirectIfAuthenticated from "@components/RedirectIfAuthenticated";

function LoginPage() {
  const APP_BASE = import.meta.env.VITE_APP_BASE;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { redirectToPage } = useAuthRedirect();

  const handleGoogleLogin = () => {
    const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_BASE}/auth/google`;
    window.location.href = GOOGLE_LOGIN_URL;
  };

  const onSubmit = async loginData => {
    try {
      await loginAndRedirect({
        loginUser,
        dispatch,
        navigate,
        loginData,
        onSuccess: redirectToPage,
      });
    } catch (err) {
      const message = err?.data?.message || "登入失敗，請稍後再試";
      toast.error(message);
    }
  };

  return (
    <>
      <RedirectIfAuthenticated />
      <div className="container py-20">
        <div className="row">
          {/* 登入表單 */}
          <div className="col-lg-6">
            <div className="d-flex flex-column gap-5">
              <h2>會員登入</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-7">
                <div>
                  {/* Email */}
                  <label htmlFor="loginEmail" className="form-label required">
                    Email
                  </label>
                  <input
                    id="loginEmail"
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="請輸入 Email"
                    {...register("email")}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div>
                  {/* 密碼 */}
                  <label htmlFor="loginPassword" className="form-label required">
                    密碼
                  </label>
                  <input
                    id="loginPassword"
                    type="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="請輸入密碼"
                    {...register("password")}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password.message}</div>
                  )}
                </div>
                {/* 提交按鈕 */}
                <BtnPrimary type="submit" size="large" className="w-100" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      登入中...
                    </>
                  ) : (
                    "登入"
                  )}
                </BtnPrimary>
              </form>
              {/* Google 登入 */}
              <div className="d-flex align-items-center">
                <hr className="flex-grow-1" />
                <div className="px-3 text-nowrap">或用以下方式登入</div>
                <hr className="flex-grow-1" />
              </div>
              <BtnPrimary type="button" className="w-100" onClick={handleGoogleLogin}>
                <img src={`${APP_BASE}GoogleIcon.svg`} alt="Google Icon" className="me-2" />
                使用 Google 登入
              </BtnPrimary>
              <p className="text-sans text-m text-end">
                還沒有會員？立即前往<Link to="/register">註冊</Link>
              </p>
            </div>
          </div>
          {/* 登入圖 */}
          <div className="col-lg-6 text-center d-none d-lg-block">
            <img
              src={`${APP_BASE}loginpage/loginImage.jpg`}
              alt="拾光堂 User Login"
              className="rounded-pill w-50"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
