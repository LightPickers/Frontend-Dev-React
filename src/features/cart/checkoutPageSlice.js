import { createSlice } from "@reduxjs/toolkit";

const savedState = JSON.parse(localStorage.getItem("checkoutForm")) || {
  shippingMethod: "宅配到府",
  recipient: "self",
  paymentMethod: "信用卡付款",
  deliveryDate: "none",
  deliveryTime: "無希望時間",
  couponCode: "",
};

const checkoutPageSlice = createSlice({
  name: "checkoutPage",
  initialState: savedState,
  reducers: {
    setCheckoutField(state, action) {
      const { name, value } = action.payload;
      state[name] = value;
      localStorage.setItem("checkoutForm", JSON.stringify(state));
    },
    resetCheckoutForm(state) {
      Object.assign(state, {
        shippingMethod: "宅配到府",
        recipient: "self",
        paymentMethod: "信用卡付款",
        deliveryDate: "none",
        deliveryTime: "無希望時間",
        couponCode: "",
      });
      localStorage.removeItem("checkoutForm");
    },
  },
});

export const { setCheckoutField, resetCheckoutForm } = checkoutPageSlice.actions;
export default checkoutPageSlice.reducer;
