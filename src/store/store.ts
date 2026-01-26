import { configureStore } from "@reduxjs/toolkit";

// reducers
import homePageSliderImgsReducer from "./fetures/homePageSliderImgsSlice";
import ordersReducer from "./fetures/ordersSlice";
import productsReducer from "./fetures/productsSlice";
import topMessageReducer from "./fetures/topMessageSlice";
import userReducer from "./fetures/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
    products: productsReducer,
    homePageSliderImgs: homePageSliderImgsReducer,
    topMessage: topMessageReducer,
  },
});
