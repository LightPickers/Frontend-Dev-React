import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useResetPasswordEmailMutation } from "@/features/users/userApi";
import { forgotPasswordSchema } from "@/schemas/users/forgotPasswordSchema";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { BtnPrimary } from "@/components/Buttons";

function ForgotPasswordPage() {
  const [resetPassword, { isLoading }] = useResetPasswordEmailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = async data => {
    try {
      await resetPassword({ to: data.email }).unwrap();
      toast.success("重設密碼連結已寄出，請至信箱查看");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "寄送失敗，請稍後再試"));
    }
  };

  return (
    <div className="container py-20">
      <div className="row justify-content-center">
        <div className=" col-md-8 col-lg-6">
          <div className="d-flex flex-column gap-6">
            <h2 className="text-lg-center">重設密碼</h2>
            <div className="d-lg-flex justify-content-center text-muted flex-wrap">
              <p className="mb-2">請輸入您註冊時使用的 Email，</p>
              <p>我們將寄送一封重設密碼的連結至您的信箱。</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-5">
              <input
                type="email"
                id="email"
                placeholder="請輸入註冊的 Email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                {...register("email")}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}

              <BtnPrimary type="submit" className="w-100" disabled={isLoading}>
                送出重設密碼連結
              </BtnPrimary>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
