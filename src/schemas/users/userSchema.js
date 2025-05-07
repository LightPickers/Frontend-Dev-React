import { z } from "zod";

export const emailSchema = z.string().min(1, "Email 為必填欄位").email("Email 格式錯誤");

export const passwordSchema = z
  .string()
  .min(8, "密碼至少 8 碼")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
    "密碼需包含英文大小寫與數字，至少 8 碼、至多 16 碼"
  );

export const nameSchema = z
  .string()
  .min(1, "姓名為必填欄位")
  .regex(/^[a-zA-Z\u4e00-\u9fa5]{2,10}$/, "姓名須為 2-10 個字，不可包含特殊符號、空白與數字");
export const phoneSchema = z
  .string()
  .min(1, "電話為必填欄位")
  .regex(/^09\d{8}$/, "手機格式有誤，請確認為 09 開頭，後接 8 碼數字");

export const genderSchema = z.enum(["male", "female", "others"], {
  errorMap: () => ({ message: "請選擇性別" }),
});

export const birthDateSchema = z
  .string()
  .min(1, "生日為必填欄位")
  .regex(/^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, "請輸入正確的日期格式 YYYY-MM-DD")
  .refine(
    value => {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      // 日期不正確
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return false;
      }

      const now = new Date();
      // 不可為未來日期
      if (date > now) return false;

      const age = now.getFullYear() - year;
      // 年齡必須在 0～120 歲
      if (age < 0 || age > 120) return false;

      return true;
    },
    {
      message: "日期無效或超出合理年齡範圍",
    }
  );

export const addressCitySchema = z.string().optional();
// export const addressCitySchema = z.string().min(1, "縣市為必填欄位");
export const addressDistrictSchema = z.string().optional();
// export const addressDistrictSchema = z.string().min(1, "鄉鎮區為必填欄位");
export const zipcodeSchema = z.string().regex(/^\d{3}$/, "請選擇縣市以及行政區域");
export const addressDetailSchema = z.string().min(1, "地址為必填欄位");

export const photoSchema = z.union([
  z.string().url("請填入正確的圖片網址"),
  z.string().length(0),
  z.null(),
  z.undefined(),
]);
