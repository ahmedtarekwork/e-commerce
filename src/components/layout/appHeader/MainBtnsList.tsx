// react
import { useEffect } from "react";

// router
import { Link } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import useDispatch from "../../../hooks/useDispatch";
import { logoutUser, setCart } from "../../../store/fetures/userSlice";

// icons
import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

// types
import { OrderProductType, RootStateType } from "../../../utiles/types";
import useGetUserCart from "../../../hooks/CartRequest/useGetUserCart";

const MainBtnsList = () => {
  const dispatch = useDispatch();
  const { user, userCart } = useSelector((state: RootStateType) => state.user);

  const { refetch: getCart, data: cart } = useGetUserCart();

  useEffect(() => {
    if (cart && !("msg" in cart)) dispatch(setCart(cart));
  }, [cart, dispatch]);
  useEffect(() => {
    getCart();
  }, []);

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
              <span id="cart-products-length">{productsLength}</span>
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
