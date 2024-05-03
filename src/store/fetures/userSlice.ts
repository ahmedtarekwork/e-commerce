import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartType, UserType } from "../../utiles/types";
import Cookies from "js-cookie";

type InitStateType = {
  user: null | UserType;
  userCart: CartType | null;
  cartMsg: string;
  allUsers: UserType[];
};

const initialState: InitStateType = {
  user: null,
  userCart: null,
  cartMsg: "",
  allUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // current user
    setUser: (state, { payload }: PayloadAction<UserType>) => {
      state.user = payload;
    },
    removeUser: (state) => {
      state.user = null;
    },
    logoutUser: (state) => {
      state.user = null;
      Cookies.remove("dashboard-jwt-token");
      window.location.href = "/login";
    },

    // all users
    setAllUsers: (state, { payload }: PayloadAction<UserType[]>) => {
      state.allUsers = payload;
    },
    resetAllUsers: (state) => {
      state.allUsers = [];
    },

    // cart
    setCart: (state, { payload }: PayloadAction<CartType>) => {
      state.userCart = payload;
      state.cartMsg = "";
    },
    resteCart: (state, { payload }: PayloadAction<string | undefined>) => {
      state.userCart = null;
      state.cartMsg = payload || "you don't have items in your cart";
    },
  },
});

export const {
  setUser,
  removeUser,
  setAllUsers,
  resetAllUsers,
  logoutUser,
  setCart,
  resteCart,
} = userSlice.actions;

export default userSlice.reducer;
