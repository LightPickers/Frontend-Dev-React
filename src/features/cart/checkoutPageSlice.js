import { createSlice } from "@reduxjs/toolkit";

const savedState = JSON.parse(localStorage.getItem("checkoutForm")) || {
  shippingMethod: "",
  recipient: "",
  paymentMethod: "",
  deliveryDate: "none",
  deliveryTime: "",
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
        shippingMethod: "",
        recipient: "",
        paymentMethod: "",
        deliveryDate: "none",
        deliveryTime: "",
        couponCode: "",
      });
      localStorage.removeItem("checkoutForm");
    },
  },
});

export const { setCheckoutField, resetCheckoutForm } = checkoutPageSlice.actions;
export default checkoutPageSlice.reducer;
