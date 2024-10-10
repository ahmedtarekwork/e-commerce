import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { showMsgFnParamsType } from "../../utils/types";

type InitialState = {
  msgData: (showMsgFnParamsType & { show: boolean }) | undefined;
};

const initialState: InitialState = { msgData: undefined };

const topMessageSlice = createSlice({
  name: "topMessage",
  initialState,
  reducers: {
    showMsg: (
      state,
      {
        payload: { time = 3500, ...params },
      }: PayloadAction<showMsgFnParamsType & { show?: boolean }>
    ) => {
      state.msgData = {
        ...params,
        show: "show" in params ? params.show! : true,
        time,
      };
    },
  },
});

export default topMessageSlice.reducer;

export const { showMsg } = topMessageSlice.actions;
