// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// react router dom
import { MemoryRouter } from "react-router-dom";

// RTL
import { render } from "@testing-library/react";

// types
import type { ReactElement, ReactNode } from "react";
import type { RootStateType, UserType } from "../../utils/types";

// redux
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// reducers
import homePageSliderImgsReducer from "../../store/fetures/homePageSliderImgsSlice";
import ordersReducer from "../../store/fetures/ordersSlice";
import productsReducer from "../../store/fetures/productsSlice";
import topMessageReducer from "../../store/fetures/topMessageSlice";
import userReducer from "../../store/fetures/userSlice";

export const rootReducer = combineReducers({
  user: userReducer,
  orders: ordersReducer,
  products: productsReducer,
  homePageSliderImgs: homePageSliderImgsReducer,
  topMessage: topMessageReducer,
});

type RenderOptions = {
  route?: string;
  user?: UserType;
  preloadedState?: Partial<RootStateType>;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = "/", preloadedState }: RenderOptions = {}
) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </Provider>
    );
  }

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper }),
  };
}
