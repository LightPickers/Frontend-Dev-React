import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart(state) {
      state.isCartOpen = true;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
    setCartSummary(state, action) {
      const { totalItems, totalPrice } = action.payload;
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
  },
});

export const { toggleCart, openCart, closeCart, setCartSummary } = cartSlice.actions;
export default cartSlice.reducer;
