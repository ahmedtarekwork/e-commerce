// react
import { useEffect } from "react";

// react router dom
import { Link, useLocation } from "react-router-dom";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
import useSelector from "../../hooks/redux/useSelector";
// redux actions
import { resetCart, setCart } from "../../store/fetures/userSlice";

// hooks
import useGetUserCart from "../../hooks/ReactQuery/CartRequest/useGetUserCart";
import useInitProductsCells from "../../hooks/useInitProductsCells";

// components
import GridList from "../gridList/GridList";
import DisplayError from "../layout/DisplayError";
import EmptyPage, { type WithBtnType } from "../layout/EmptyPage";
import ProductCard from "../productCard/ProductCard";
import ProfilePageTabsError from "../ProfilePageTabsError";
import UserAreaLoading from "../UserAreaLoading";
import CartAreaDownInfo from "./CartAreaDownInfo";

// icons
import { BsFillCartXFill } from "react-icons/bs";

// SVGs
import cartSvg from "../../../imgs/cart.svg";

// types
import type { CartType } from "../../utils/types";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import { slideOutVariant } from "../../utils/variants";

type Props = {
  userId: string;
  withAddMore?: boolean;
  showTotal?: boolean;
  withDeleteBtn?: boolean;
};

const replaceQty = (arr: string[]) =>
  arr.map((cell) => (cell === "quantity" ? "count" : cell));

const CartArea = ({
  userId,
  withDeleteBtn,
  withAddMore,
  showTotal = true,
}: Props) => {
  const { pathname } = useLocation();
  const isCurrentUserCart = !pathname.includes("singleUser");

  // redux
  const dispatch = useDispatch();
  const { userCart } = useSelector((state) => state.user);

  // hooks
  const { listCell, productCardCells } = useInitProductsCells();

  // react query => get cart data
  const {
    refetch: getCart,
    data: cart,
    error: cartErrData,
    isError: cartErr,
    isLoading: cartLoading,
  } = useGetUserCart(userId);

  const choosedCart = (isCurrentUserCart ? userCart : cart) as
    | CartType
    | undefined;

  useEffect(() => {
    if (isCurrentUserCart) getCart();
    else {
      if (userId) getCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrentUserCart, userId]);

  useEffect(() => {
    if (cart && isCurrentUserCart) {
      const isSame = () => {
        const sameLength =
          userCart?.products?.length === cart?.products?.length;

        if (!sameLength) return false;

        return userCart?.products?.every((prd) => {
          return cart?.products?.some((p) => p._id === prd._id);
        });
      };

      if (!isSame()) dispatch(setCart(cart));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, dispatch]);

  useEffect(() => {
    if (isCurrentUserCart && userCart?.products?.length) {
      if (cartErr || !cart || (isCurrentUserCart && !userCart)) {
        dispatch(resetCart());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartErr, cart, isCurrentUserCart, userCart]);

  if (!isCurrentUserCart && !userId) {
    return (
      <strong style={{ color: "var(--dark)", fontSize: 25 }}>
        User Id not found
      </strong>
    );
  }

  if (cartLoading) {
    return (
      <UserAreaLoading isCurrentUserProfile={isCurrentUserCart}>
        Loading Cart Items...
      </UserAreaLoading>
    );
  }

  if (cartErr || !cart || (isCurrentUserCart && !userCart)) {
    if (isCurrentUserCart) {
      return (
        <DisplayError
          error={cartErrData}
          initMsg="Can't get your cart items at the moment"
        />
      );
    } else {
      return (
        <div className="no-specific-user-cart-holder">
          <BsFillCartXFill />

          <strong>Can't get this user cart items at the moment</strong>
        </div>
      );
    }
  }

  const withBtn = (
    !userCart?.products?.length
      ? {
          type: "custom",
          btn: (
            <Link
              style={{
                marginInline: "auto",
                marginTop: 10,
              }}
              to="/products"
              relative="path"
              className="btn"
            >
              Browse Our Products
            </Link>
          ),
        }
      : undefined
  ) as WithBtnType;

  if (!cart.products?.length) {
    if (isCurrentUserCart) {
      return (
        <EmptyPage
          svg={cartSvg}
          content={`${
            isCurrentUserCart ? "you do" : "this user does"
          }n't have items in ${isCurrentUserCart ? "your" : "his"} cart`}
          withBtn={withBtn}
        />
      );
    }

    return (
      <ProfilePageTabsError
        Icon={BsFillCartXFill}
        content="this user dosen't have any products in his cart"
      />
    );
  }

  if (!isCurrentUserCart) {
    return (
      <>
        <GridList
          withMargin={!!withDeleteBtn}
          initType="row"
          isChanging={false}
          cells={replaceQty(listCell)}
        >
          {(cart as CartType)?.products?.map((prd) => {
            return (
              <ProductCard
                className="rows-list-cell"
                withAddMore={withAddMore}
                withDeleteBtn={{ type: "cart" }}
                product={prd}
                cells={replaceQty(productCardCells)}
              />
            );
          })}
        </GridList>

        {showTotal && <CartAreaDownInfo userCart={cart as CartType} />}
      </>
    );
  }

  if (isCurrentUserCart) {
    return (
      <AnimatePresence mode="wait" initial={false}>
        {!(choosedCart as CartType)?.products?.length && (
          <motion.div
            key="one"
            variants={slideOutVariant}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <EmptyPage
              svg={cartSvg}
              content={`${
                isCurrentUserCart ? "you do" : "this user does"
              }n't have items in ${isCurrentUserCart ? "your" : "his"} cart`}
              withBtn={withBtn}
            />
          </motion.div>
        )}

        {(choosedCart as CartType)?.products?.length && (
          <motion.div
            key="two"
            variants={slideOutVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              zIndex: "calc(var(--header-index) - 2)",
            }}
            layout
          >
            <GridList
              withMargin={!!withDeleteBtn}
              initType="row"
              isChanging={false}
              cells={replaceQty(listCell)}
            >
              <AnimatePresence>
                {(choosedCart as CartType)?.products?.map(
                  (prd, i, { length }) => {
                    return (
                      <motion.li
                        className="no-grid"
                        key={prd._id}
                        variants={slideOutVariant}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                        style={{
                          position: "relative",
                          zIndex: length - i,
                        }}
                      >
                        <ProductCard
                          TagName="div"
                          className="rows-list-cell"
                          withAddMore={withAddMore}
                          withDeleteBtn={{ type: "cart" }}
                          product={prd}
                          cells={replaceQty(productCardCells)}
                        />
                      </motion.li>
                    );
                  }
                )}
              </AnimatePresence>
            </GridList>

            {showTotal && <CartAreaDownInfo userCart={cart as CartType} />}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
};
export default CartArea;
