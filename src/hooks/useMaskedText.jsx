import { maskEmail, maskName } from "@utils/maskInfo";

export function useMaskedText(value, type = "name", options = {}) {
  if (!value) return "";

  switch (type) {
    case "name":
      return maskName(value, options);
    case "email":
      return maskEmail(value, options);
    default:
      return value;
  }
}
