import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { HomePageSliderImgType } from "../../utiles/types";

type InitStateType = {
  imgs: HomePageSliderImgType[];
};

const initialState: InitStateType = {
  imgs: [],
};

const homePageSliderImgsSlice = createSlice({
  name: "homePageSliderImgs",
  initialState,

  reducers: {
    setHomeSliderImgsAction: (
      state,
      { payload }: PayloadAction<HomePageSliderImgType[]>
    ) => {
      state.imgs = payload;
    },

    addImgsToHomeSliderAction: (
      state,
      { payload }: PayloadAction<HomePageSliderImgType[]>
    ) => {
      state.imgs = [...state.imgs, ...payload];
    },

    removeImgsFromHomeSliderAction: (
      state,
      { payload }: PayloadAction<string[]>
    ) => {
      state.imgs = state.imgs.filter(
        ({ _id }) => !payload.some((removeId) => removeId === _id)
      );
    },
  },
});

export default homePageSliderImgsSlice.reducer;

export const {
  addImgsToHomeSliderAction,
  setHomeSliderImgsAction,
  removeImgsFromHomeSliderAction,
} = homePageSliderImgsSlice.actions;
