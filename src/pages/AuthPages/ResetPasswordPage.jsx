import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import { useResetPasswordConfirmMutation } from "@/features/users/userApi";
import { resetPasswordSchema } from "@/schemas/users/resetPasswordSchema";
import { BtnPrimary } from "@/components/Buttons";

function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let tokenFromSearch = searchParams.get("token");

    if (!tokenFromSearch) {
      const hash = window.location.hash;
      const rawQuery = hash.split("?")[1];
      const hashParams = new URLSearchParams(rawQuery);
      tokenFromSearch = hashParams.get("token");
    }

    setToken(tokenFromSearch || "");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [resetPassword, { isLoading }] = useResetPasswordConfirmMutation();

  const onSubmit = async data => {
    if (!token) {
      toast.error("無效的重設連結");
      return;
    }

    try {
      console.log("送出重設密碼：", {
        token,
        newPassword: data.password,
        confirm_new_password: data.confirmPassword,
      });
      await resetPassword({
        token,
        new_password: data.password,
        confirm_new_password: data.confirmPassword,
      }).unwrap();

      toast.success("密碼重設成功，請重新登入");
      navigate("/login");
    } catch {
      toast.error("密碼重設失敗，請稍後再試");
    }
  };

  return (
    <div className="container py-20">
      <div className="row justify-content-center">
        <div className=" col-md-8 col-lg-6">
          <div className="d-flex flex-column gap-6">
            <h2 className="text-lg-center">重設密碼</h2>

            <p className="text-muted text-lg-center"> 請輸入您的新密碼並再次確認。</p>

            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-5">
              <div>
                <label className="form-label required">新密碼</label>
                <input
                  type="password"
                  id="password"
                  placeholder="請輸入新密碼"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  {...register("password")}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password.message}</div>
                )}
              </div>
              <div>
                <label className="form-label required">確認密碼</label>
                <input
                  type="password"
                  placeholder="請輸入確認密碼"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                )}
              </div>
              <BtnPrimary type="submit" className="w-100" disabled={isLoading}>
                送出新密碼
              </BtnPrimary>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
