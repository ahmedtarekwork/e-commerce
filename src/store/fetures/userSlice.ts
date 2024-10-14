import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

// types
import type { CartType, UserType } from "../../utils/types";

type InitStateType = {
  user: null | UserType;
  userCart: CartType | null;
  allUsers: UserType[];
  cartLoading: boolean;
  wishlistLoading: boolean;
};

const initialState: InitStateType = {
  user: null,
  userCart: null,
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
    logoutUser: (state) => {
      state.user = null;
    },

    // all users
    setAllUsers: (state, { payload }: PayloadAction<UserType[]>) => {
      state.allUsers = payload;
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
      state.cartLoading = false;
    },
    resetCart: (state) => {
      state.userCart = { products: [], orderdby: state.user?._id || "" };
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
  logoutUser,

  // current user wishlist
  resetUserWishlist,
  setUserWishlist,
  toggleWishlistLoading,

  // all users
  setAllUsers,

  // current user cart
  setCart,
  resetCart,
  setCartLoading,
} = userSlice.actions;

export default userSlice.reducer;
