import { z } from "zod";

import { emailSchema, passwordSchema } from "@schemas/users/userSchema";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
