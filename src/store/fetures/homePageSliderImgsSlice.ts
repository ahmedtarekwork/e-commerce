import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ImageType } from "../../utils/types";

type InitStateType = {
  imgs: ImageType[];
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
      { payload }: PayloadAction<ImageType[]>
    ) => {
      state.imgs = payload;
    },

    addImgsToHomeSliderAction: (
      state,
      { payload }: PayloadAction<ImageType[]>
    ) => {
      state.imgs = [...state.imgs, ...payload];
    },

    removeImgsFromHomeSliderAction: (
      state,
      { payload }: PayloadAction<string[]>
    ) => {
      state.imgs = state.imgs.filter(
        ({ public_id }) => !payload?.some((removeId) => removeId === public_id)
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
