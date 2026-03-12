import { configureStore } from "@reduxjs/toolkit";

// reducers
import homePageSliderImgsReducer from "./fetures/homePageSliderImgsSlice";
import productsReducer from "./fetures/productsSlice";
import topMessageReducer from "./fetures/topMessageSlice";
import userReducer from "./fetures/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    homePageSliderImgs: homePageSliderImgsReducer,
    topMessage: topMessageReducer,
  },
});
