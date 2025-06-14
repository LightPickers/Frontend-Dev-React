import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { useUploadImageMutation } from "@/features/upload/uploadApi";
import useTaiwanDistricts from "@hooks/useTaiwanDistricts";
import { BtnPrimary } from "@components/Buttons";
import TaiwanAddressSelector from "@components/TaiwanAddressSelector";
import { profileSchema } from "@schemas/users/profileSchema";
import { registerSchema } from "@schemas/users/registerSchema";
import { googleRegisterSchema } from "@schemas/users/googleRegisterSchema";

function UserProfileForm({
  isEdit = false,
  onSubmit,
  userData = null,
  isSubmitting = false,
  isLoggingin = false,
  isGoogleUser = false,
}) {
  const validateSchema = isEdit
    ? profileSchema
    : isGoogleUser
      ? googleRegisterSchema
      : registerSchema;
  const methods = useForm({
    resolver: zodResolver(validateSchema),
    mode: "onBlur",
    defaultValues: {
      address_city: "",
      address_district: "",
      address_zipcode: "",
    },
  });

  const APP_BASE = import.meta.env.VITE_APP_BASE;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    trigger,
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

      // console.log("重置表單資料:", userData);
      reset(fallbackData);
      originalDataRef.current = { ...userData };
    }
  }, [userData, reset, taiwanDistricts]);

  const onFormSubmit = data => {
    console.log("表單提交資料:", data);
    const { birth_year, birth_month, birth_day, ...rest } = data;
    const birth_date = `${birth_year}-${birth_month.padStart(2, "0")}-${birth_day.padStart(2, "0")}`;
    const finalData = { ...rest, birth_date };
    originalDataRef.current = finalData;
    onSubmit(finalData);
  };

  const [imageUrl, setImageUrl] = useState("");
  const [subImages, setSubImages] = useState([]);
  const [uploadImage] = useUploadImageMutation();
  const [isUploadingPrimaryImage, setIsUploadingPrimaryImage] = useState(false);
  const [isUploadingSubImages, setIsUploadingSubImages] = useState(false);
  useEffect(() => {
    if (userData?.photo) {
      setImageUrl(userData.photo);
    }
  }, [userData]);

  return (
    <div className="container py-20">
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <div className="d-flex flex-column gap-5">
            <h2>{isEdit ? "編輯個人資料" : "會員註冊"}</h2>
            {isGoogleUser && (
              <>
                <p className="text-muted">
                  您已透過 Google 登入，我們已取得您的 Email、姓名與頭像資訊。
                  <br />
                  請補充以下必要資料以完成註冊。
                </p>
                <div className="divider-line"></div>
              </>
            )}
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
                <fieldset
                  disabled={isSubmitting || isLoggingin}
                  className="d-flex flex-column gap-7"
                >
                  {/* 頭像 */}
                  <div className="d-flex flex-column">
                    <label className="form-label">頭像（點選可更換）</label>
                    <div>
                      <label
                        className="form-label"
                        style={{ cursor: "pointer", display: "inline-block" }}
                        htmlFor="photo"
                      >
                        <img
                          src={imageUrl || `${APP_BASE}uploadImage.png`}
                          alt="點擊上傳"
                          className={errors.photo ? "border border-danger" : ""}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            border: errors.photo ? "1px solid #dc3545" : "1px dashed #ccc",
                            borderRadius: "50%",
                            backgroundColor: "white",
                          }}
                        />
                      </label>
                    </div>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setIsUploadingPrimaryImage(true);
                        const formData = new FormData();
                        formData.append("files", file);
                        try {
                          const res = await uploadImage(formData).unwrap();
                          setImageUrl(res.data.image_urls?.[0]);
                          setValue("photo", res.data.image_urls?.[0]);
                          trigger("photo");
                          toast.success("頭像上傳成功");
                          setIsUploadingPrimaryImage(false);
                        } catch (err) {
                          console.error("上傳失敗", err);
                          toast.error("頭像上傳失敗");
                          setIsUploadingPrimaryImage(false);
                        }
                      }}
                    />
                    {errors.photo && <div className="invalid-feedback">{errors.photo.message}</div>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="form-label required">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      id="email"
                      placeholder="請輸入 Email"
                      {...register("email")}
                      disabled={isEdit || isGoogleUser}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                    {isGoogleUser && (
                      <small className="form-text text-muted">
                        此 Email 為 Google 提供，無法修改
                      </small>
                    )}
                  </div>

                  {/* 密碼 */}
                  {!isEdit && !isGoogleUser && (
                    <div>
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
                  <div>
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
                  <div>
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
                    {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                  </div>

                  {/* 性別 */}
                  <div>
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
                  <div>
                    <label className="form-label required">生日</label>
                    <div className="d-flex gap-2">
                      <div className="d-flex flex-column w-100">
                        <select
                          className={`form-select ${errors.birth_year ? "is-invalid" : ""}`}
                          {...register("birth_year")}
                        >
                          <option value="">年</option>
                          {Array.from({ length: 100 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                        {errors.birth_year && (
                          <div className="invalid-feedback d-block">
                            {errors.birth_year?.message}
                          </div>
                        )}
                      </div>
                      <div className="d-flex flex-column w-100">
                        <select
                          className={`form-select ${errors.birth_month ? "is-invalid" : ""}`}
                          {...register("birth_month")}
                        >
                          <option value="">月</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        {errors.birth_month && (
                          <div className="invalid-feedback d-block">
                            {errors.birth_month?.message}
                          </div>
                        )}
                      </div>
                      <div className="d-flex flex-column w-100">
                        <select
                          className={`form-select ${errors.birth_day ? "is-invalid" : ""}`}
                          {...register("birth_day")}
                        >
                          <option value="">日</option>
                          {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        {errors.birth_day && (
                          <div className="invalid-feedback d-block">
                            {errors.birth_day?.message}
                          </div>
                        )}
                      </div>
                    </div>
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
                    {!isEdit && isGoogleUser && !isSubmitting && "新增資料"}
                    {!isEdit && isGoogleUser && isSubmitting && "新增資料中…"}
                    {!isEdit && !isGoogleUser && !isSubmitting && "註冊"}
                    {!isEdit && !isGoogleUser && isSubmitting && !isLoggingin && "註冊中…"}
                    {!isEdit && !isGoogleUser && isSubmitting && isLoggingin && "登入中…"}
                  </BtnPrimary>
                </fieldset>
              </form>
            </FormProvider>
          </div>
        </div>
        <div className="col-lg-6 text-center d-none d-lg-block">
          <img
            src={`${APP_BASE}loginpage/loginImage.jpg`}
            alt="拾光堂 User Login"
            className="rounded-pill w-50"
            style={{ position: "sticky", top: "170px" }}
          />
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
  isGoogleUser: PropTypes.bool,
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
