// react
import { useEffect, useState } from "react";

// react router dom
import { Link, useLocation } from "react-router-dom";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
import useSelector from "../../hooks/redux/useSelector";
// redux actions
import { resteCart, setCart } from "../../store/fetures/userSlice";

// hooks
import useGetUserCart from "../../hooks/ReactQuery/CartRequest/useGetUserCart";
import useInitProductsCells from "../../hooks/useInitProductsCells";

// components
import GridList from "../gridList/GridList";
import DisplayError from "../layout/DisplayError";
import UserAreaLoading from "../UserAreaLoading";
import CartAreaDownInfo from "./CartAreaDownInfo";
import EmptyPage, { type WithBtnType } from "../layout/EmptyPage";
import ProductCard, {
  type ProductCardDeleteBtn,
} from "../productCard/ProductCard";

// icons
import { BsFillCartXFill } from "react-icons/bs";

// SVGs
import cartSvg from "../../../imgs/cart.svg";

// types
import type { CartType } from "../../utiles/types";

// framer motion
import { AnimatePresence, motion } from "framer-motion";
// variants
import {
  // cartOrWishlistAreasVariants,
  slideOutVariant,
} from "../../utiles/variants";

type Props = ProductCardDeleteBtn & {
  userId?: string;
  withAddMore?: boolean;
  showTotal?: boolean;
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
  const { userCart, cartMsg } = useSelector((state) => state.user);

  // states
  const [specificUserCartMsg, setSpecificUserCartMsg] = useState("");

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
    if (isCurrentUserCart) {
      getCart();
    } else {
      if (userId) getCart();
    }
  }, [isCurrentUserCart, userId]);

  useEffect(() => {
    if (cart) {
      if (isCurrentUserCart) {
        if ("msg" in cart) dispatch(resteCart(cart.msg));
        else {
          const isSame = () => {
            const sameLength =
              userCart?.products?.length === cart?.products?.length;

            if (!sameLength) return false;

            return userCart?.products.every((prd) => {
              return cart.products.some((p) => p._id === prd._id);
            });
          };

          if (!isSame) dispatch(setCart(cart));
        }
      } else {
        if ("msg" in cart) setSpecificUserCartMsg(cart.msg);
      }
    }
  }, [cart, dispatch]);

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

  if (cartErr || !cart || (isCurrentUserCart && !userCart && !cartMsg)) {
    if (isCurrentUserCart) {
      userCart?.products.length ? dispatch(resteCart()) : null;

      return (
        <DisplayError
          error={cartErrData!}
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
    !userCart?.products.length
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

  if (isCurrentUserCart && cartMsg) {
    userCart?.products.length ? dispatch(resteCart()) : null;
  }

  if (!isCurrentUserCart && specificUserCartMsg) {
    return (
      <div className="no-specific-user-cart-holder">
        <BsFillCartXFill />

        <strong>{specificUserCartMsg}</strong>
      </div>
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
                withDeleteBtn={withDeleteBtn}
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            variants={slideOutVariant}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <EmptyPage svg={cartSvg} content={cartMsg} withBtn={withBtn} />
          </motion.div>
        )}

        {(choosedCart as CartType)?.products?.length && (
          <motion.div
            key="two"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                          withDeleteBtn={withDeleteBtn}
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
