import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { BtnPrimary } from "@components/Buttons";
import { useLoginUserMutation } from "@features/users/userApi";
import { loginSchema } from "@schemas/users/loginSchema";
import loginAndRedirect from "@features/auth/loginAndRedirect";
import useAuthRedirect from "@hooks/useAuthRedirect";
import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";

function LoginPage() {
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

  const onSubmit = async loginData => {
    await loginAndRedirect({
      loginUser,
      dispatch,
      navigate,
      loginData,
      onSuccess: redirectToPage,
    }); // hook 只能在元件存變數後傳給通用函式
  };

  return (
    <>
      <RedirectIfAuthenticated />
      <div className="container py-5 mt-25">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6 mx-auto">
            <div className="card shadow rounded-4">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">會員登入</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <fieldset disabled={isLoading}>
                    {/* email */}
                    <div className="mb-3">
                      <label htmlFor="loginEmail" className="form-label required">
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="loginEmail"
                        placeholder="請輸入 Email"
                        {...register("email")}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email.message}</div>
                      )}
                    </div>

                    {/* 密碼 */}
                    <div className="mb-3">
                      <label htmlFor="loginPassword" className="form-label required">
                        密碼
                      </label>
                      <input
                        type="password"
                        id="loginPassword"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        placeholder="請輸入密碼"
                        {...register("password")}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password.message}</div>
                      )}
                    </div>
                    <p className="text-sans text-m text-end">
                      還沒有會員？前往<Link to="/register">註冊</Link>
                    </p>

                    {/* 提交按鈕 */}
                    <BtnPrimary type="submit" size="large" className="w-100" disabled={isLoading}>
                      {isLoading ? "登入中..." : "登入"}
                    </BtnPrimary>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
