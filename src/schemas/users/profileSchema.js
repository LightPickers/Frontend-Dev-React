import { z } from "zod";

import {
  addressCitySchema,
  addressDetailSchema,
  addressDistrictSchema,
  birthDateSchema,
  emailSchema,
  genderSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
  photoSchema,
  zipcodeSchema,
} from "@schemas/users/userSchema";

export const profileSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  photo: photoSchema,
  gender: genderSchema,
  birth_date: birthDateSchema,
  address_city: addressCitySchema,
  address_district: addressDistrictSchema,
  address_zipcode: zipcodeSchema,
  address_detail: addressDetailSchema,
});
