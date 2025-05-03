import { z } from "zod";

import {
  addressDetailSchema,
  addressDistrictSchema,
  birthDateSchema,
  emailSchema,
  genderSchema,
  nameSchema,
  phoneSchema,
  photoSchema,
  zipcodeSchema,
} from "@schemas/users/userSchema";

export const profileSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  phone: phoneSchema,
  photo: photoSchema,
  gender: genderSchema,
  birth_date: birthDateSchema,
  address_district: addressDistrictSchema,
  address_zipcode: zipcodeSchema,
  address_detail: addressDetailSchema,
});
