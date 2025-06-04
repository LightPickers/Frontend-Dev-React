import { z } from "zod";

export const getCheckoutSchema = (couponsList = []) =>
  z.object({
    shippingMethod: z.string().refine(val => val === "宅配到府", { message: "請選擇配送方式" }),

    recipient: z.string().refine(val => val === "self", { message: "請選擇配送方式" }),

    paymentMethod: z.string().refine(val => val === "信用卡付款", { message: "請選擇配送方式" }),

    deliveryDate: z.string().min(1, "請選擇配送日期"),

    deliveryTime: z
      .string()
      .refine(val => ["無希望時間", "8 點 ~ 13 點前", "14 點 ~ 18 點"].includes(val), {
        message: "請選擇配送時段",
      }),

    couponCode: z
      .string()
      .optional()
      .refine(
        code => {
          if (!code || !code.trim()) return true;
          const now = new Date();
          const match = couponsList.find(c => c.code === code.trim());
          if (!match) return false;

          const start = new Date(match.start_at);
          const end = new Date(match.end_at);

          return (
            match.is_available &&
            now >= start &&
            now <= end &&
            match.distributed_quantity < match.quantity
          );
        },
        {
          message: "優惠碼無效、已過期或已用完",
        }
      ),
  });
