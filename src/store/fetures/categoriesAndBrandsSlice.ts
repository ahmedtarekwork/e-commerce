import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategoryAndBrandType } from "../../utils/types";

type State = {
  categories: CategoryAndBrandType[];
  brands: CategoryAndBrandType[];
};

type PayloadType<T extends Record<string, unknown>> = PayloadAction<
  { type: keyof Pick<State, "brands" | "categories"> } & T
>;

const initialState: State = { categories: [], brands: [] };

const categoriesAndBrandsSlice = createSlice({
  name: "categoriesAndBrands",
  initialState,
  reducers: {
    setCategoriesOrBrand: (
      state,
      { payload }: PayloadType<{ categoriesOrBrands: CategoryAndBrandType[] }>
    ) => {
      state[payload.type] = payload.categoriesOrBrands;
    },

    removeCategoryOrBrand: (
      state,
      { payload }: PayloadType<{ id: string }>
    ) => {
      state[payload.type] = state.categories.filter(
        (cat) => cat._id !== payload.id
      );
    },

    editCategoryOrBrand: (
      state,
      { payload }: PayloadType<{ newCategoryOrBrand: CategoryAndBrandType }>
    ) => {
      state[payload.type] = state.categories.map((cat) => {
        if (cat._id === payload.newCategoryOrBrand._id)
          cat = payload.newCategoryOrBrand;

        return cat;
      });
    },

    addCategoryOrBrand: (
      state,
      { payload }: PayloadType<{ newCategoryOrBrand: CategoryAndBrandType }>
    ) => {
      state[payload.type] = [
        ...state[payload.type],
        payload.newCategoryOrBrand,
      ];
    },
  },
});

export default categoriesAndBrandsSlice.reducer;
export const {
  setCategoriesOrBrand,
  removeCategoryOrBrand,
  addCategoryOrBrand,
  editCategoryOrBrand,
} = categoriesAndBrandsSlice.actions;
