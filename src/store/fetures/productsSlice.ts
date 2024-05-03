import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProductType } from "../../utiles/types";

type InitStateType = {
  products: ProductType[];
};

const initialState: InitStateType = {
  products: [],
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
    addProduct: (state, { payload }: PayloadAction<ProductType>) => {
      state.products = [...state.products, payload];
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
  addProduct,
  removeProduct,
  editProduct,
} = productsSlice.actions;
