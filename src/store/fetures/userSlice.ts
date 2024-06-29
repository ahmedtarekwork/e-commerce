import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { CartType, UserType } from "../../utiles/types";
import Cookies from "js-cookie";

type InitStateType = {
  user: null | UserType;
  userCart: CartType | null;
  cartMsg: string;
  allUsers: UserType[];
  cartLoading: boolean;
  wishlistLoading: boolean;
};

const initialState: InitStateType = {
  user: null,
  userCart: null,
  cartMsg: "",
  allUsers: [],
  cartLoading: false,
  wishlistLoading: false,
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

    // current user wishlist
    resetUserWishlist: (state) => {
      if (state.user?.wishlist) state.user.wishlist = [];
    },
    setUserWishlist: (state, { payload }: PayloadAction<string[]>) => {
      if (state.user?.wishlist) state.user.wishlist = payload;
    },
    toggleWishlistLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.wishlistLoading = payload;
    },

    // current user cart
    setCart: (state, { payload }: PayloadAction<CartType>) => {
      state.userCart = payload;
      state.cartMsg = "";
      state.cartLoading = false;
    },
    resteCart: (state, { payload }: PayloadAction<string | undefined>) => {
      state.userCart = null;
      state.cartMsg = payload || "you don't have items in your cart";
      state.cartLoading = false;
    },
    setCartLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.cartLoading = payload;
    },
  },
});

export const {
  // current user
  setUser,
  removeUser,
  logoutUser,

  // current user wishlist
  resetUserWishlist,
  setUserWishlist,
  toggleWishlistLoading,

  // all users
  setAllUsers,
  resetAllUsers,

  // current user cart
  setCart,
  resteCart,
  setCartLoading,
} = userSlice.actions;

export default userSlice.reducer;
