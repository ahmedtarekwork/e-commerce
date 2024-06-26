import { configureStore } from "@reduxjs/toolkit";

// reducers
import userReducer from "./fetures/userSlice";
import ordersReducer from "./fetures/ordersSlice";
import productsReducer from "./fetures/productsSlice";
import homePageSliderImgsReducer from "./fetures/homePageSliderImgsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
    products: productsReducer,
    homePageSliderImgs: homePageSliderImgsReducer,
  },
});
