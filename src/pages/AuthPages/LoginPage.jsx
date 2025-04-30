import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import BtnPrimary from "@/components/Button";

function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE;

  const onSubmit = async data => {
    try {
      const res = await axios.post(`${API_BASE}/login`, data);
      const { token } = res.data.data;
      const { id: userId } = jwtDecode(token);
      localStorage.setItem("token", token);
      console.log(localStorage.getItem("token"));
      navigate(`/account/${userId}/settings`);
    } catch (error) {
      console.error(error);
      alert("登入失敗");
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-md-8 col-lg-6 mx-auto">
          <div className="card shadow rounded-4">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">會員登入</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="registerEmail"
                    placeholder="請輸入 Email"
                    {...register("email")}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">
                    密碼
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    placeholder="請輸入密碼"
                    {...register("password")}
                  />
                </div>

                <BtnPrimary size="large" className="w-100">
                  登入
                </BtnPrimary>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
