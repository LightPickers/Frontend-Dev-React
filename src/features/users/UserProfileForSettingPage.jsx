import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useTaiwanDistricts from "@hooks/useTaiwanDistricts";
import { BtnPrimary } from "@components/Buttons";
import TaiwanAddressSelectorForSettingPage from "@components/TaiwanAddressSelectorForSettingPage";
import { profileSchema } from "@schemas/users/profileSchema";
import { registerSchema } from "@schemas/users/registerSchema";

function UserProfileForSettingPage({
  isEdit = false,
  onSubmit,
  userData = null,
  isSubmitting = false,
  isLoggingin = false,
  hasPhotoChange = false, // 新增：是否有照片變更
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

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // 保存原始表單數據，用於比較是否有實際更改
  const originalDataRef = useRef(null);

  // 監聽表單值的變化
  const watchAllFields = watch();

  // 電話號碼格式化函數
  const formatPhoneForDisplay = phoneNumber => {
    if (!phoneNumber) return "未設定";

    // 移除所有非數字字符
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.length === 10 && cleanPhone.startsWith("09")) {
      const start = cleanPhone.substring(0, 2);
      const end = cleanPhone.substring(cleanPhone.length - 2);
      const middleStars = "*".repeat(Math.max(0, cleanPhone.length - 4));
      return `${start}${middleStars}${end}`;
    }
  };

  const hasRealChanges = () => {
    // 如果有照片變更，直接返回 true
    if (hasPhotoChange) return true;

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

      // console.log("重置表單資料:", userData);
      reset(fallbackData);
      originalDataRef.current = { ...userData };
    }
  }, [userData, reset, taiwanDistricts]);

  const onFormSubmit = data => {
    // console.log("表單提交資料:", data);

    // 更新原始資料參考
    originalDataRef.current = { ...data };

    onSubmit(data);
  };

  return (
    <div className="container py-0 mt-0">
      <div className="row">
        <div className="col-12">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
              <fieldset disabled={isSubmitting || isLoggingin}>
                {/* Email 無修改模式*/}
                <div className="mb-3">
                  <div
                    className=" small mb-0 fw-bold"
                    style={{
                      color: "#939393",
                    }}
                  >
                    使用者帳號
                  </div>
                  <div className="fw-normal">{userData?.email || "未設定"}</div>
                </div>

                {/* 密碼 目前只有註冊時才顯示*/}
                {!isEdit && (
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
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
                  <div
                    className=" small mb-0 fw-bold"
                    style={{
                      color: "#939393",
                    }}
                  >
                    姓名
                  </div>

                  {!isEditingName ? (
                    // 顯示模式 - 純文字
                    <div className="d-flex align-items-end mb-1" style={{ gap: "8px" }}>
                      <div className="fw-normal">{watchAllFields.name || "未設定"}</div>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-underline small"
                        style={{
                          color: "#4A6465",
                          fontSize: "0.75rem",
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = "#8BB0B7")}
                        onMouseOut={e => (e.currentTarget.style.color = "#4A6465")}
                        onClick={() => setIsEditingName(true)}
                        disabled={isSubmitting || isLoggingin}
                      >
                        修改
                      </button>
                    </div>
                  ) : (
                    // 編輯模式 - 可input
                    <div className="d-flex align-items-end gap-2">
                      <div className="col-3 p-0">
                        <input
                          type="text"
                          className={`form-control ${errors.name ? "is-invalid" : ""}`}
                          id="name"
                          placeholder="請輸入姓名"
                          {...register("name")}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-underline small"
                        style={{
                          color: "#4A6465",
                          fontSize: "0.75rem",
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = "#8BB0B7")}
                        onMouseOut={e => (e.currentTarget.style.color = "#4A6465")}
                        onClick={() => setIsEditingName(false)}
                        disabled={isSubmitting || isLoggingin}
                      >
                        取消
                      </button>
                    </div>
                  )}

                  {errors.name && (
                    <div className="invalid-feedback d-block">{errors.name.message}</div>
                  )}
                </div>

                {/* 電話 */}
                <div className="mb-3">
                  <div
                    className=" small mb-0 fw-bold"
                    style={{
                      color: "#939393",
                    }}
                  >
                    電話
                  </div>

                  {!isEditingPhone ? (
                    // 顯示模式 - 純文字
                    <div className="d-flex align-items-end mb-1" style={{ gap: "8px" }}>
                      <div className="fw-normal">{formatPhoneForDisplay(watchAllFields.phone)}</div>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-underline small"
                        style={{
                          color: "#4A6465",
                          fontSize: "0.75rem",
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = "#8BB0B7")}
                        onMouseOut={e => (e.currentTarget.style.color = "#4A6465")}
                        onClick={() => setIsEditingPhone(true)}
                        disabled={isSubmitting || isLoggingin}
                      >
                        修改
                      </button>
                    </div>
                  ) : (
                    // 編輯模式 - 可input
                    <div className="d-flex align-items-end gap-2">
                      <div className="col-3 p-0">
                        <input
                          type="text"
                          className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                          id="registerPhone"
                          placeholder="請輸入聯絡電話"
                          {...register("phone")}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-underline small"
                        style={{
                          color: "#4A6465",
                          fontSize: "0.75rem",
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = "#8BB0B7")}
                        onMouseOut={e => (e.currentTarget.style.color = "#4A6465")}
                        onClick={() => setIsEditingPhone(false)}
                        disabled={isSubmitting || isLoggingin}
                      >
                        取消
                      </button>
                    </div>
                  )}

                  {errors.phone && (
                    <div className="invalid-feedback d-block">{errors.phone.message}</div>
                  )}
                </div>

                {/* 性別 */}
                <div className="mb-3">
                  <label
                    className=" small mb-0 fw-bold"
                    style={{
                      color: "#939393",
                    }}
                  >
                    性別
                  </label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        className={`form-check-input ${errors.gender ? "is-invalid" : ""}`}
                        id="male"
                        value="male"
                        {...register("gender")}
                      />
                      <div htmlFor="male" className="form-check-label">
                        男性
                      </div>
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
                  <div
                    htmlFor="birthDate"
                    className=" small mb-0 fw-bold"
                    style={{
                      color: "#939393",
                    }}
                  >
                    生日
                  </div>
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
                <TaiwanAddressSelectorForSettingPage errors={errors} key="address-selector" />

                {/* 詳細地址 */}
                <div className="mb-3">
                  <div
                    htmlFor="address"
                    className=" small mb-0 fw-bold"
                    style={{
                      color: "#939393",
                    }}
                  >
                    地址
                  </div>
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
  );
}

UserProfileForSettingPage.propTypes = {
  isEdit: PropTypes.bool,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isLoggingin: PropTypes.bool,
  hasPhotoChange: PropTypes.bool, // 新增 PropType
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

export default UserProfileForSettingPage;
