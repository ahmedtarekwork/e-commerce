// Router
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";

// Pages \\
import LoginOrSignupPage from "../pages/LoginOrSignupPage";
// home
import EcommerceHomePage from "../pages/e-commerce/homePage/EcommerceHomePage";
import DashboardHomePage from "../pages/dashboard/dashboardHomePage/DashboardHomePage";
import HomePageSettingsPage from "../pages/dashboard/homePageSettings/HomePageSettingsPage";
// users
import ProfilePage from "../pages/profilePage/ProfilePage";
import UsersPage from "../pages/dashboard/usersPage/UsersPage";
// products
import ProductsPage from "../pages/products/productsPage/ProductsPage";
import NewProductPage from "../pages/products/ProductFormPage";
import SingleProductPage from "../pages/products/SingleProductPage";
// orders
import SingleOrderPage from "../pages/orders/SingleOrderPage";
import OrdersPage from "../pages/orders/OrdersPage";
// payment
import PaymentSuccessOrFailPage from "../pages/e-commerce/payment/successOrFailedPage/PaymentSuccessOrFailedPage";
import DonationPage from "../pages/e-commerce/payment/DonatePage/DonationPage";
// cart or wishlist
import CartOrWishlistPage from "../pages/e-commerce/cartAndWishlist/CartOrWishlistPage";
// more pages
import EmptyPage from "../components/layout/EmptyPage";

// layouts \\
import MainLayout from "../layouts/MainLayout";
// auth layouts
import NotAuthLayout from "../layouts/NotAuthLayout";
import AlreadyLogedInLayout from "../layouts/AlreadyLogedInLayout";
import NeedLoginLayout from "../layouts/NeedLoginLayout";

// SVGs
import ErrSvg from "../../imgs/404.svg";

const useAppRouter = (checkUserLoading: boolean) => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<MainLayout />}>
        {/* no login nedded for these page*/}
        <Route element={<EcommerceHomePage />} index />
        <Route element={<ProductsPage />} path={"products"} />
        <Route path="product/:id" element={<SingleProductPage />} />

        {/* payment routes */}
        <Route
          path="successPayment"
          element={<PaymentSuccessOrFailPage type="success" />}
        />
        <Route
          path="failedPayment"
          element={<PaymentSuccessOrFailPage type="failed" />}
        />
        {/* donation routes */}
        <Route path="donate" element={<DonationPage />} />
        <Route
          path="successPayment/donate"
          element={<PaymentSuccessOrFailPage type="success" />}
        />
        <Route
          path="failedPayment/donate"
          element={<PaymentSuccessOrFailPage type="failed" />}
        />

        {/*
          if user already loged in => redirect him to home page
          else => go to login or signup page
          */}
        <Route element={<AlreadyLogedInLayout />}>
          <Route path="login" element={<LoginOrSignupPage type="login" />} />
          <Route path="signup" element={<LoginOrSignupPage type="signup" />} />
        </Route>

        {/* login necessery for access these routes */}
        <Route element={<NeedLoginLayout />}>
          <Route element={<CartOrWishlistPage />} path="cart" />
          <Route element={<CartOrWishlistPage />} path="wishlist" />

          <Route element={<OrdersPage />} path="orders" />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders/:id" element={<SingleOrderPage />} />
          <Route path="product/:id" element={<SingleProductPage />} />

          {/* donation page route */}
        </Route>

        {/* need to be admin to access these routes */}
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
          <Route path="homePageSettings" element={<HomePageSettingsPage />} />
        </Route>

        <Route
          path="*"
          element={
            <EmptyPage
              content={"This Page Not Found!"}
              svg={ErrSvg}
              withBtn={{ type: "GoToHome" }}
            />
          }
        />
      </Route>
    )
  );
};

export default useAppRouter;
