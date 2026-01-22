import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ProductType } from "../../utils/types";

type InitStateType = {
  products: ProductType[];
  pagenatedProducts: Record<number, ProductType[]>;
};

const initialState: InitStateType = {
  products: [],
  pagenatedProducts: {},
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, { payload }: PayloadAction<ProductType[]>) => {
      state.products = payload;
    },
    resetProducts: (state) => {
      state.products = [];
    },
    addProducts: (state, { payload }: PayloadAction<ProductType[]>) => {
      const oldProducts = state.products.filter(({ _id }) =>
        payload.every(({ _id: same }) => same !== _id)
      );
      const newProducts = payload;

      state.products = [...oldProducts, ...newProducts];
    },
    removeProduct: (state, { payload }: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product._id !== payload
      );
    },
  },
});

export default productsSlice.reducer;

export const { setProducts, resetProducts, addProducts, removeProduct } =
  productsSlice.actions;
