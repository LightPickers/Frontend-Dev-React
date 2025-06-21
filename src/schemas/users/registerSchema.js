import { z } from "zod";

import {
  addressDetailSchema,
  addressDistrictSchema,
  addressCitySchema,
  emailSchema,
  passwordSchema,
  genderSchema,
  nameSchema,
  phoneSchema,
  photoSchema,
  zipcodeSchema,
} from "@schemas/users/userSchema";

export const registerSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  phone: phoneSchema,
  photo: photoSchema,
  gender: genderSchema,
  address_district: addressDistrictSchema,
  address_zipcode: zipcodeSchema,
  address_detail: addressDetailSchema,
  password: passwordSchema,
  address_city: addressCitySchema,
  birth_year: z.string().min(1, "請選擇年份"),
  birth_month: z.string().min(1, "請選擇月份"),
  birth_day: z.string().min(1, "請選擇日期"),
});
