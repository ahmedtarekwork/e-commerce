import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { OrderType } from "../../utiles/types";

type InitStateType = {
  orders: OrderType[];
};

const initialState: InitStateType = {
  orders: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, { payload }: PayloadAction<OrderType[]>) => {
      state.orders = payload;
    },
  },
});

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
