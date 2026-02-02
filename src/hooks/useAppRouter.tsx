// Router
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Pages \\
import LoginOrSignupPage from "../pages/LoginOrSignupPage";
// home
import DashboardHomePage from "../pages/dashboard/dashboardHomePage/DashboardHomePage";
import HomePageSettingsPage from "../pages/dashboard/homePageSettings/HomePageSettingsPage";
import EcommerceHomePage from "../pages/e-commerce/homePage/EcommerceHomePage";
// users
import UsersPage from "../pages/dashboard/usersPage/UsersPage";
import ProfilePage from "../pages/profilePage/ProfilePage";
// products
import ProductFormPage from "../pages/products/productsFormPage/ProductFormPage";
import ProductsPage from "../pages/products/productsPage/ProductsPage";
import SingleProductPage from "../pages/products/SingleProductPage";
// orders
import OrdersPage from "../pages/orders/OrdersPage";
import SingleOrderPage from "../pages/orders/SingleOrderPage";
// payment
import DonationPage from "../pages/e-commerce/payment/DonatePage/DonationPage";
import PaymentSuccessOrFailPage from "../pages/e-commerce/payment/successOrFailedPage/PaymentSuccessOrFailedPage";
// cart or wishlist
import CartOrWishlistPage from "../pages/e-commerce/cartAndWishlist/CartOrWishlistPage";
import WishlistPage from "../pages/e-commerce/wishlistPage/WishlistPage";
// more pages
import EmptyPage from "../components/layout/EmptyPage";

// layouts \\
import MainLayout from "../layouts/MainLayout";
// auth layouts
import AlreadyLogedInLayout from "../layouts/AlreadyLogedInLayout";
import NeedLoginLayout from "../layouts/NeedLoginLayout";
import NotAuthLayout from "../layouts/NotAuthLayout";

// SVGs
import ErrSvg from "../../imgs/404.svg";
import CategoriesAndBrandsConfigPage from "../pages/dashboard/categoriesAndBrandsConfigPage/CategoriesAndBrandsConfigPage";
import CategoriesAndBrandsPage from "../pages/e-commerce/CategoriesAndBrandsPage";

const useAppRouter = (checkUserLoading: boolean) => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<MainLayout />}>
        {/* no login nedded for these page*/}
        <Route element={<EcommerceHomePage />} index />
        <Route element={<ProductsPage />} path="products" />
        <Route path="product/:id" element={<SingleProductPage />} />

        <Route
          element={<CategoriesAndBrandsPage type="categories" />}
          path="categories"
        />
        <Route
          element={<CategoriesAndBrandsPage type="brands" />}
          path="brands"
        />

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
          <Route element={<WishlistPage />} path="wishlist" />

          <Route element={<OrdersPage />} path="orders" />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="orders/:id" element={<SingleOrderPage />} />
          <Route path="product/:id" element={<SingleProductPage />} />
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
          <Route path="new-product" element={<ProductFormPage />} />
          <Route path="edit-product/:id" element={<ProductFormPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<SingleOrderPage />} />
          <Route path="homePageSettings" element={<HomePageSettingsPage />} />

          <Route
            path="categories"
            element={<CategoriesAndBrandsPage type="categories" />}
          />
          <Route
            path="brands"
            element={<CategoriesAndBrandsPage type="brands" />}
          />

          <Route
            path="categoriesForm"
            element={<CategoriesAndBrandsConfigPage type="categories" />}
          />
          <Route
            path="brandsForm"
            element={<CategoriesAndBrandsConfigPage type="brands" />}
          />
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
