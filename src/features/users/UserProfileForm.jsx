import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useTaiwanDistricts from "@hooks/useTaiwanDistricts";
import { BtnPrimary } from "@components/Buttons";
import TaiwanAddressSelector from "@components/TaiwanAddressSelector";
import { profileSchema } from "@schemas/users/profileSchema";
import { registerSchema } from "@schemas/users/registerSchema";

function UserProfileForm({
  isEdit = false,
  onSubmit,
  userData = null,
  isSubmitting = false,
  isLoggingin = false,
}) {
  const validateSchema = isEdit ? profileSchema : registerSchema;
  const methods = useForm({
    resolver: zodResolver(validateSchema),
    mode: "onBlur",
    defaultValues: {
      address_city: "",
      address_district: "",
      address_zipcode: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { isDirty, errors, dirtyFields },
  } = methods;

  // 保存原始表單數據，用於比較是否有實際更改
  const originalDataRef = useRef(null);

  // 監聽表單值的變化
  const watchAllFields = watch();

  // 實現自己的 "isDirty" 檢查，檢測實際內容是否改變
  const hasRealChanges = () => {
    if (!originalDataRef.current) return isDirty;

    // 比較當前值和原始值
    const currentValues = getValues();
    const originalValues = originalDataRef.current;

    // 檢查每個欄位
    for (const key in currentValues) {
      // 如果欄位被標記為 dirty，檢查值是否實際改變
      if (dirtyFields[key]) {
        // 特殊處理日期字段
        if (key === "birth_date") {
          const currentDate = currentValues[key] ? new Date(currentValues[key]) : null;
          const originalDate = originalValues[key] ? new Date(originalValues[key]) : null;

          if (currentDate && originalDate) {
            if (currentDate.getTime() !== originalDate.getTime()) return true;
          } else if (currentDate !== originalDate) {
            return true;
          }
        }
        // 一般字段比較
        else if (currentValues[key] !== originalValues[key]) {
          return true;
        }
      }
    }

    return false;
  };

  const { data: taiwanDistricts } = useTaiwanDistricts();

  useEffect(() => {
    if (userData && taiwanDistricts) {
      const address_zipcode = userData.address_zipcode;
      let address_city = userData.address_city;
      let address_district = userData.address_district;

      if (address_zipcode && (!address_city || !address_district)) {
        for (const cityItem of taiwanDistricts) {
          const districtItem = cityItem.districts.find(
            district => district.zip === address_zipcode
          );
          if (districtItem) {
            address_city = cityItem.name;
            address_district = districtItem.name;
            break;
          }
        }
      }
      const fallbackData = {
        ...userData,
        address_city: address_city,
        address_district: address_district,
      };

      console.log("重置表單資料:", userData);
      reset(fallbackData);
      originalDataRef.current = { ...userData };
    }
  }, [userData, reset, taiwanDistricts]);

  const onFormSubmit = data => {
    console.log("表單提交數據:", data);

    // 更新原始資料參考
    originalDataRef.current = { ...data };

    onSubmit(data);
  };

  return (
    <div className="container py-5 mt-25">
      <div className="row">
        <div className="col-12 col-md-8 col-lg-6 mx-auto">
          <div className="card shadow rounded-4">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {isEdit ? "編輯個人資料" : "會員註冊"}
              </h2>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
                  <fieldset disabled={isSubmitting || isLoggingin}>
                    {/* Email */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label required">
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        placeholder="請輸入 Email"
                        {...register("email")}
                        disabled={isEdit}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email.message}</div>
                      )}
                    </div>

                    {/* 密碼 */}
                    {!isEdit && (
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label required">
                          密碼
                        </label>
                        <input
                          type="password"
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          id="password"
                          placeholder="請輸入密碼"
                          {...register("password")}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                      </div>
                    )}

                    {/* 姓名 */}
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label required">
                        姓名
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        id="name"
                        placeholder="請輸入姓名"
                        {...register("name")}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>

                    {/* 電話 */}
                    <div className="mb-3">
                      <label className="form-label required" htmlFor="registerPhone">
                        電話
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        id="registerPhone"
                        placeholder="請輸入聯絡電話"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone.message}</div>
                      )}
                    </div>

                    {/* 頭像 */}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="avatar">
                        頭像
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.photo ? "is-invalid" : ""}`}
                        id="avatar"
                        placeholder="請輸入頭像網址"
                        {...register("photo")}
                      />
                      {errors.photo && (
                        <div className="invalid-feedback">{errors.photo.message}</div>
                      )}
                    </div>

                    {/* 性別 */}
                    <div className="mb-3">
                      <label className="form-label required">性別</label>
                      <div className="d-flex gap-3">
                        <div className="form-check">
                          <input
                            type="radio"
                            className={`form-check-input ${errors.gender ? "is-invalid" : ""}`}
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
                            className={`form-check-input ${errors.gender ? "is-invalid" : ""}`}
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
                            className={`form-check-input ${errors.gender ? "is-invalid" : ""}`}
                            type="radio"
                            id="others"
                            value="others"
                            {...register("gender")}
                          />
                          <label htmlFor="others" className="form-check-label">
                            其他
                          </label>
                        </div>
                      </div>
                      {errors.gender && (
                        <div className="invalid-feedback d-block">{errors.gender.message}</div>
                      )}
                    </div>

                    {/* 生日 */}
                    <div className="mb-3">
                      <label htmlFor="birthDate" className="form-label required">
                        生日
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.birth_date ? "is-invalid" : ""}`}
                        id="birthDate"
                        {...register("birth_date")}
                      />
                      {errors.birth_date && (
                        <div className="invalid-feedback">{errors.birth_date.message}</div>
                      )}
                    </div>

                    {/* 台灣地址選擇器 */}
                    {/* 保持地址選擇器的引用，確保重置後也保留值 */}
                    <TaiwanAddressSelector errors={errors} key="address-selector" />

                    {/* 詳細地址 */}
                    <div className="mb-4">
                      <label htmlFor="address" className="form-label required">
                        地址
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.address_detail ? "is-invalid" : ""}`}
                        id="address"
                        placeholder="請輸入詳細地址"
                        {...register("address_detail")}
                      />
                      {errors.address_detail && (
                        <div className="invalid-feedback">{errors.address_detail.message}</div>
                      )}
                    </div>

                    <BtnPrimary
                      type="submit"
                      size="large"
                      className="w-100"
                      disabled={!hasRealChanges() || isSubmitting || isLoggingin}
                    >
                      {isEdit && !isSubmitting && "儲存"}
                      {isEdit && isSubmitting && "儲存中…"}
                      {!isEdit && !isSubmitting && "註冊"}
                      {!isEdit && isSubmitting && !isLoggingin && "註冊中…"}
                      {!isEdit && isSubmitting && isLoggingin && "登入中…"}
                    </BtnPrimary>
                  </fieldset>
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
  isSubmitting: PropTypes.bool,
  isLoggingin: PropTypes.bool,
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
