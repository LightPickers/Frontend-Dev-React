import { createSlice } from "@reduxjs/toolkit";

const getDefaultDeliveryDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 4);
  return today.toISOString().split("T")[0];
};

const initialState = {
  shippingMethod: "",
  recipient: "",
  paymentMethod: "",
  deliveryDate: getDefaultDeliveryDate(),
  deliveryTime: "",
  couponCode: "",
};

const checkoutPageSlice = createSlice({
  name: "checkoutPage",
  initialState,
  reducers: {
    setCheckoutField(state, action) {
      const { name, value } = action.payload;
      state[name] = value;
    },
    resetCheckoutForm(state) {
      state.shippingMethod = "";
      state.recipient = "";
      state.paymentMethod = "";
      state.deliveryDate = getDefaultDeliveryDate();
      state.deliveryTime = "";
      state.couponCode = "";
    },
    updateDeliveryDate(state) {
      const newDate = getDefaultDeliveryDate();
      // 檢查當前日期是否仍然有效
      if (state.deliveryDate && state.deliveryDate !== "none") {
        const selectedDate = new Date(state.deliveryDate);
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 4);

        // 如果選中的日期已經過期，更新為新的預設日期
        if (selectedDate < minDate) {
          state.deliveryDate = newDate;
        }
      }
    },
  },
});

export const { setCheckoutField, resetCheckoutForm, updateDeliveryDate } =
  checkoutPageSlice.actions;
export default checkoutPageSlice.reducer;
