import { z } from "zod";

export const emailSchema = z.string().min(1, "Email 為必填欄位").email("Email 格式錯誤");

export const passwordSchema = z
  .string()
  .min(8, "密碼至少 8 碼")
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/, "密碼需包含英文大小寫與數字");

export const nameSchema = z.string().min(1, "姓名為必填欄位");
export const phoneSchema = z
  .string()
  .min(1, "電話為必填欄位")
  .regex(/^09\d{8}$/);

export const genderSchema = z.enum(["male", "female", "others"], {
  errorMap: () => ({ message: "請選擇性別" }),
});

export const birthDateSchema = z
  .string()
  .min(1, "生日為必填欄位")
  .refine(val => !isNaN(Date.parse(val)), { message: "日期格式錯誤" });

export const addressCitySchema = z.string().optional();
// export const addressCitySchema = z.string().min(1, "縣市為必填欄位");
export const addressDistrictSchema = z.string().optional();
// export const addressDistrictSchema = z.string().min(1, "鄉鎮區為必填欄位");
export const zipcodeSchema = z.string().regex(/^\d{3}$/, "郵遞區號格式錯誤");
export const addressDetailSchema = z.string().min(1, "地址為必填欄位");

export const photoSchema = z.string().url("請填入正確的圖片網址").optional();
