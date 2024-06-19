import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ProductType } from "../../utiles/types";

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
      const oldProducts = state.products;
      const newProducts = oldProducts.length
        ? payload.filter(({ _id }) =>
            oldProducts.every(({ _id: same }) => same !== _id)
          )
        : payload;

      state.products = [...oldProducts, ...newProducts];
    },
    removeProduct: (state, { payload }: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product._id !== payload
      );
    },
    editProduct: (state, { payload }: PayloadAction<ProductType>) => {
      state.products = state.products.map((product) =>
        product._id === payload._id ? payload : product
      );
    },
  },
});

export default productsSlice.reducer;

export const {
  setProducts,
  resetProducts,
  addProducts,
  removeProduct,
  editProduct,
} = productsSlice.actions;
