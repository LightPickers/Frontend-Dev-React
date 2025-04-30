import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import BtnPrimary from "@/components/Button";

function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();

  const onSubmit = async data => {
    try {
      delete data.address_city;
      console.log(data);
      const dataToSend = {
        ...data,
      };
      await axios.post(`${API_BASE}/signup`, dataToSend);
      console.log("註冊成功");
      try {
        const { email, password } = dataToSend;
        const loginData = { email, password };
        const res = await axios.post(`${API_BASE}/login`, loginData);
        console.log("登入成功");
        const { token } = res.data.data;
        const { id: userId } = jwtDecode(token);
        localStorage.setItem("token", token);
        navigate(`/account/${userId}/settings`);
      } catch (error) {
        console.error(error);
        alert("登入失敗");
      }
    } catch (error) {
      console.error(error);
      alert("註冊失敗");
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-md-8 col-lg-6 mx-auto">
          <div className="card shadow rounded-4">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">會員註冊</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="registerName" className="form-label">
                    姓名
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerName"
                    placeholder="請輸入姓名"
                    {...register("name")}
                  />
                </div>

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

                <div className="mb-3">
                  <label className="form-label" htmlFor="registerPhone">
                    電話
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerPhone"
                    placeholder="請輸入聯絡電話"
                    {...register("phone")}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="registerAvatar">
                    頭像
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerAvatar"
                    placeholder="請輸入頭像網址"
                    {...register("photo")}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">性別</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="registerMale"
                        value="male"
                        {...register("gender")}
                      />
                      <label htmlFor="registerMale" className="form-check-label">
                        男性
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="registerFemale"
                        value="female"
                        {...register("gender")}
                      />
                      <label htmlFor="registerFemale" className="form-check-label">
                        女性
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        id="registerOthers"
                        value="others"
                        {...register("gender")}
                      />
                      <label htmlFor="registerOthers" className="form-check-label">
                        其他
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="registerBirthDate" className="form-label">
                    生日
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="registerBirthDate"
                    {...register("birth_date")}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="registerCity" className="form-label">
                    縣市
                  </label>
                  <select
                    id="registerCity"
                    className="form-select"
                    defaultValue="請選擇縣市"
                    {...register("address_city")}
                  >
                    <option value="請選擇縣市" disabled>
                      請選擇縣市
                    </option>
                    <option value="台北市">台北市</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="registerDistrict" className="form-label">
                    區鄉鎮
                  </label>
                  <select
                    id="registerDistrict"
                    className="form-select"
                    defaultValue="請選擇區鄉鎮"
                    {...register("address_district")}
                  >
                    <option value="請選擇區鄉鎮" disabled>
                      請選擇區鄉鎮
                    </option>
                    <option value="信義區">信義區</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="registerZipcode" className="form-label">
                    郵遞區號
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerZipcode"
                    placeholder="例如：110"
                    {...register("address_zipcode")}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="registerAddress" className="form-label">
                    地址
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="registerAddress"
                    placeholder="請輸入詳細地址"
                    {...register("address_detail")}
                  />
                </div>

                <BtnPrimary size="large" className="w-100">
                  註冊
                </BtnPrimary>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
