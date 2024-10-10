import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ShowMsgFnType } from "../../utils/types";

type InitialState = {
  showMsg: ShowMsgFnType | undefined;
};

const initialState: InitialState = { showMsg: undefined };

const topMessageSlice = createSlice({
  name: "topMessage",
  initialState,
  reducers: {
    setTopMessageShowFn: (state, { payload }: PayloadAction<ShowMsgFnType>) => {
      state.showMsg = payload;
    },
  },
});

export default topMessageSlice.reducer;

export const { setTopMessageShowFn } = topMessageSlice.actions;
