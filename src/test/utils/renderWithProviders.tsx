import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MemoryRouter } from "react-router-dom";

import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";

// reducers
import homePageSliderImgsReducer from "../../store/fetures/homePageSliderImgsSlice";
import ordersReducer from "../../store/fetures/ordersSlice";
import productsReducer from "../../store/fetures/productsSlice";
import topMessageReducer from "../../store/fetures/topMessageSlice";
import userReducer from "../../store/fetures/userSlice";

type RenderOptions = {
  route?: string;
};

export function renderWithProviders(
  ui: ReactElement,
  { route = "/" }: RenderOptions = {}
) {
  const store = configureStore({
    reducer: {
      user: userReducer,
      orders: ordersReducer,
      products: productsReducer,
      homePageSliderImgs: homePageSliderImgsReducer,
      topMessage: topMessageReducer,
    },
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
