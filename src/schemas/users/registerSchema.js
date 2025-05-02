import { z } from "zod";

import { addressCitySchema, passwordSchema } from "@schemas/users/userSchema";
import { profileSchema } from "@/schemas/users/profileSchema";

export const registerSchema = profileSchema.extend({
  password: passwordSchema,
  address_city: addressCitySchema,
});
