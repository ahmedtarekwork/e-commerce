// react
import { useEffect, useRef } from "react";

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

const MainBtnsList = ({ type }: { type: "header" | "sidebar" }) => {
  const dispatch = useDispatch();
  const { user, userCart } = useSelector((state) => state.user);

  const { refetch: getCart, data: cart } = useGetUserCart();

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    [
      listRef.current,
      ...((listRef.current?.querySelectorAll(
        "*"
      ) as unknown as HTMLElement[]) || []),
    ].forEach((el) => {
      if (el) el.dataset.type = type;
    });
  }, []);

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
      {!user ? (
        <>
          <li>
            <Link title="go to login page btn" to="/login">
              login
            </Link>
          </li>

          <li>
            <Link title="go to signup page btn" to="/signup">
              signup
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              title="go to your cart btn"
              to="/cart"
              relative="path"
              id="header-cart-icon"
            >
              <span id="cart-products-length">
                {productsLength > 9 ? "9+" : productsLength}
              </span>
              <FaShoppingCart />
              your cart
            </Link>
          </li>

          <li>
            <Link title="go to profile page btn" to="/profile">
              <FaUserAlt />
              <span id="header-userName">
                {user?.username || "Unknwon User"}
              </span>
            </Link>
          </li>

          <li>
            <button title="logout btn" onClick={() => dispatch(logoutUser())}>
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
