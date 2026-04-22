import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

// types
import type { CartType, OrderProductType, UserType } from "../../utils/types";

export type InitStateType = {
  user: null | UserType;
  userCart:
    | CartType
    | { totalItemsLength: 0; products: OrderProductType[]; orderdby: string };
  cartLoading: boolean;
  wishlistLoading: boolean;
};

const initialState: InitStateType = {
  user: null,
  userCart: { totalItemsLength: 0, products: [], orderdby: "" },
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
    setCartLength: (state, { payload }: PayloadAction<number>) => {
      state.userCart.totalItemsLength = payload;

      state.cartLoading = false;
    },
    setCart: (state, { payload }: PayloadAction<CartType>) => {
      state.userCart = payload;
      state.cartLoading = false;
    },
    resetCart: (state) => {
      state.userCart = {
        products: [],
        orderdby: state.user?._id || "",
        totalItemsLength: 0,
      };
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

  // current user cart
  setCart,
  setCartLength,
  resetCart,
  setCartLoading,
} = userSlice.actions;

export default userSlice.reducer;
