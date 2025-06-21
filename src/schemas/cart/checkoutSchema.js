import { z } from "zod";

export const getCheckoutSchema = (couponsList = []) =>
  z.object({
    shippingMethod: z
      .string()
      .refine(val => val === "home_delivery", { message: "請選擇配送方式" }),

    recipient: z.string().refine(val => val === "self", { message: "請選擇配送方式" }),

    paymentMethod: z.string().refine(val => val === "credit_card", { message: "請選擇配送方式" }),

    deliveryDate: z.string().min(1, "請選擇配送日期"),

    deliveryTime: z
      .string()
      .refine(val => ["無希望時間", "8 點 ~ 13 點前", "14 點 ~ 18 點"].includes(val), {
        message: "請選擇配送時段",
      }),

    couponCode: z
      .string()
      .optional()
      .superRefine((code, ctx) => {
        if (!code || !code.trim()) return;

        const trimmed = code.trim();
        const match = couponsList.find(c => c.code === trimmed);
        const now = new Date();

        if (!match) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "查無此優惠碼",
          });
          return;
        }

        const start = new Date(match.start_at);
        const end = new Date(match.end_at);

        if (!match.is_available) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "此優惠碼目前不可使用",
          });
        } else if (now < start) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "此優惠碼尚未開始",
          });
        } else if (now > end) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "此優惠碼已過期",
          });
        } else if (match.distributed_quantity >= match.quantity) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "此優惠碼已達使用上限",
          });
        }
      }),
  });
