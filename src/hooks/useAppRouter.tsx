// Router
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";

// Pages \\
import LoginOrSignupPage from "../pages/LoginOrSignupPage";
// home
import EcommerceHomePage from "../pages/e-commerce/EcommerceHomePage";
import DashboardHomePage from "../pages/dashboard/dashboardHomePage/DashboardHomePage";
// users
import ProfilePage from "../pages/profilePage/ProfilePage";
import UsersPage from "../pages/dashboard/usersPage/UsersPage";
// products
import ProductsPage from "../pages/products/ProductsPage";
import NewProductPage from "../pages/products/ProductFormPage";
import SingleProductPage from "../pages/products/SingleProductPage";
// orders
import SingleOrderPage from "../pages/orders/SingleOrderPage";
import OrdersPage from "../pages/orders/OrdersPage";
// more pages
import CartOrWishlistPage from "../pages/e-commerce/CartOrWishlistPage";
import ErrorPage from "../pages/ErrorPage";

// layouts \\
import MainLayout from "../layouts/MainLayout";
// auth layouts
import NotAuthLayout from "../layouts/NotAuthLayout";
import AlreadyLogedInLayout from "../layouts/AlreadyLogedInLayout";
import NeedLoginLayout from "../layouts/NeedLoginLayout";

const useAppRouter = (checkUserLoading: boolean) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route element={<MainLayout />}>
        {/* login isn't neccessery for home page and products page*/}
        <Route element={<EcommerceHomePage />} index />
        <Route element={<ProductsPage />} path={"products"} />
        <Route path="product/:id" element={<SingleProductPage />} />

        <Route element={<AlreadyLogedInLayout />}>
          <Route path="login" element={<LoginOrSignupPage type="login" />} />
          <Route path="signup" element={<LoginOrSignupPage type="signup" />} />
        </Route>

        <Route element={<NeedLoginLayout />}>
          <Route element={<CartOrWishlistPage />} path="cart" />
          <Route element={<CartOrWishlistPage />} path="wishlist" />

          <Route element={<OrdersPage />} path="orders" />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders/:id" element={<SingleOrderPage />} />
          <Route path="product/:id" element={<SingleProductPage />} />
        </Route>

        <Route
          element={<NotAuthLayout loading={checkUserLoading} />}
          path="/dashboard"
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="singleUser/:id" element={<ProfilePage />} />

          <Route path="users" element={<UsersPage />} />

          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<SingleProductPage />} />
          <Route path="new-product" element={<NewProductPage />} />
          <Route path="edit-product/:id" element={<NewProductPage />} />

          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<SingleOrderPage />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );

export default useAppRouter;
