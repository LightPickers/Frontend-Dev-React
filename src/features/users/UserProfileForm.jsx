import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import BtnPrimary from "@components/Button";
import TaiwanAddressSelector from "@components/TaiwanAddressSelector";

function UserProfileForm({ isEdit = false, onSubmit, userData = null }) {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-md-8 col-lg-6 mx-auto">
          <div className="card shadow rounded-4">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {isEdit ? "編輯個人資料" : "會員註冊"}
              </h2>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="請輸入 Email"
                      {...register("email")}
                      disabled={isEdit}
                    />
                  </div>

                  {/* 密碼 */}
                  {!isEdit && (
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        密碼
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="請輸入密碼"
                        {...register("password")}
                      />
                    </div>
                  )}

                  {/* 姓名 */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      姓名
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="請輸入姓名"
                      {...register("name")}
                    />
                  </div>

                  {/* 電話 */}
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

                  {/* 頭像 */}
                  <div className="mb-3">
                    <label className="form-label" htmlFor="avatar">
                      頭像
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="avatar"
                      placeholder="請輸入頭像網址"
                      {...register("photo")}
                    />
                  </div>

                  {/* 性別 */}
                  <div className="mb-3">
                    <label className="form-label">性別</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="male"
                          value="male"
                          {...register("gender")}
                        />
                        <label htmlFor="male" className="form-check-label">
                          男性
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="female"
                          value="female"
                          {...register("gender")}
                        />
                        <label htmlFor="female" className="form-check-label">
                          女性
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          className="form-check-input"
                          id="others"
                          value="others"
                          {...register("gender")}
                        />
                        <label htmlFor="others" className="form-check-label">
                          其他
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 生日 */}
                  <div className="mb-3">
                    <label htmlFor="birthDate" className="form-label">
                      生日
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="birthDate"
                      {...register("birth_date")}
                    />
                  </div>

                  {/* 台灣地址選擇器 */}
                  {/* 確保表單已初始化完成 */}
                  {Object.keys(methods.formState.defaultValues || {}).length > 0 && (
                    <TaiwanAddressSelector />
                  )}

                  {/* 詳細地址 */}
                  <div className="mb-4">
                    <label htmlFor="address" className="form-label">
                      地址
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      placeholder="請輸入詳細地址"
                      {...register("address_detail")}
                    />
                  </div>

                  <BtnPrimary size="large" className="w-100" disabled={!isDirty}>
                    {isEdit ? "儲存" : "註冊"}
                  </BtnPrimary>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserProfileForm.propTypes = {
  isEdit: PropTypes.bool,
  onSubmit: PropTypes.func,
  userData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.oneOf(["male", "female", "others"]),
    birth_date: PropTypes.string,
    address_zipcode: PropTypes.string,
    address_city: PropTypes.string,
    address_district: PropTypes.string,
    address_detail: PropTypes.string,
    photo: PropTypes.string,
  }),
};

export default UserProfileForm;
