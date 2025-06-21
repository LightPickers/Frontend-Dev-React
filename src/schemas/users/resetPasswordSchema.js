import { z } from "zod";

import { passwordSchema } from "./userSchema";

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(8, "請再次輸入密碼")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
        "密碼需包含英文大小寫與數字，至少 8 碼、至多 16 碼"
      ),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "兩次密碼輸入不一致",
    path: ["confirmPassword"],
  });
