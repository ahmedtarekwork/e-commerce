// react
import { useEffect } from "react";

// router
import { Link } from "react-router-dom";

// redux
import useSelector from "../../../hooks/redux/useSelector";
import useDispatch from "../../../hooks/redux/useDispatch";
// redux actions
import { logoutUser, setCart } from "../../../store/fetures/userSlice";

// icons
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

// types
import type { OrderProductType } from "../../../utiles/types";

// hooks
import useGetUserCart from "../../../hooks/ReactQuery/CartRequest/useGetUserCart";

const MainBtnsList = () => {
  const dispatch = useDispatch();
  const { user, userCart } = useSelector((state) => state.user);

  const { refetch: getCart, data: cart } = useGetUserCart();

  useEffect(() => {
    if (cart && !("msg" in cart)) dispatch(setCart(cart));
  }, [cart, dispatch]);

  useEffect(() => {
    if (user) getCart();
  }, [user]);

  let productsLength = 0;

  const userCartCount = userCart?.products?.map(
    (prd: OrderProductType) => prd.count
  );
  if (userCartCount?.length)
    productsLength = userCartCount.reduce((a: number, b: number) => a + b);

  return (
    <ul className="main-btns-list">
      {!user && (
        <>
          <Link to="/login">login</Link>
          <Link to="/signup">signup</Link>
        </>
      )}

      {user && (
        <>
          <li>
            <Link to="/cart" relative="path" id="header-cart-icon">
              <span id="cart-products-length">
                {productsLength > 9 ? "9+" : productsLength}
              </span>
              <FaShoppingCart />
              your cart
            </Link>
          </li>

          <li>
            <Link to="/profile" className="close-side">
              <FaUserAlt />
              <span id="header-userName">
                {user?.username || "Unknwon User"}
              </span>
            </Link>
          </li>

          <li>
            <button
              onClick={() => dispatch(logoutUser())}
              className="close-side"
            >
              <IoLogOut className="logOut-icon" />
              signout
            </button>
          </li>
        </>
      )}
    </ul>
  );
};

export default MainBtnsList;
