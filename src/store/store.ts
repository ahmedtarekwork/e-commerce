import { configureStore } from "@reduxjs/toolkit";

// reducers
import userReducer from "./fetures/userSlice";
import ordersReducer from "./fetures/ordersSlice";
import productsReducer from "./fetures/productsSlice";
import homePageSliderImgsReducer from "./fetures/homePageSliderImgsSlice";
import categoriesAndBrandsReducer from "./fetures/categoriesAndBrandsSlice";
import topMessageReducer from "./fetures/topMessageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    orders: ordersReducer,
    products: productsReducer,
    categoriesAndBrands: categoriesAndBrandsReducer,
    homePageSliderImgs: homePageSliderImgsReducer,
    topMessage: topMessageReducer,
  },
});
