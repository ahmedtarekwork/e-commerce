import ReactDOM from "react-dom/client";

// react query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// redux
import { Provider } from "react-redux";
import { store } from "./store/store";

// App.tsx
import App from "./App";

// components
import TopMessage from "./components/TopMessage";

// css
import "./sass/main.css";

// prepair react query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />

      <TopMessage />
    </QueryClientProvider>
  </Provider>
);
