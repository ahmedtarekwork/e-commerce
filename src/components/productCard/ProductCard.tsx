// react
import { useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

// react query
import {
  useMutation,
  // , useQuery
} from "@tanstack/react-query";

// redux
import useSelector from "../../hooks/redux/useSelector";
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import {
  setUser,

  // user cart
  setCart,
  resteCart,
} from "../../store/fetures/userSlice";

// components
import ImgsSlider from "../ImgsSlider";
import PropCell from "../PropCell";
import TopMessage, { type TopMessageRefType } from "../TopMessage";
import FillIcon from "../FillIcon";
import EmptySpinner from "../spinners/EmptySpinner";
// import SelectList, {
//   type selectListOptionType,
// } from "../selectList/SelectList";

// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineDelete, AiFillDelete } from "react-icons/ai";

// utils
import handleError from "../../utiles/functions/handleError";
import { axiosWithToken } from "../../utiles/axios";

// types
import type { OrderProductType, ProductType } from "../../utiles/types";

// hooks
import useInitProductsCells from "../../hooks/useInitProductsCells";
import useAddToCart from "../../hooks/ReactQuery/CartRequest/useAddToCart";
import useToggleFromWishlist from "../../hooks/ReactQuery/useToggleFromWishlist";
import ProductCardQtyList from "./ProductCardQtyList";

export type ProductCardDeleteBtn = {
  withDeleteBtn?: "cart" | "wishlist";
};

type Props = ProductCardDeleteBtn & {
  product: ProductType | OrderProductType;
  cells?: (keyof Partial<ProductType> | string)[];
  withAddToCart?: boolean;
  withAddToWishList?: boolean;
  withAddMore?: boolean;
  imgWidth?: `${number}px`;
  TagName?: "div" | "li";
  withQty?: boolean;
  className?: string;
};

// fetchers
const removeItemFromCartMutationFn = async (prdId: string) => {
  return (await axiosWithToken.delete("/carts/cartProduct/" + prdId)).data;
};

const ProductCard = ({
  product,
  cells,
  withAddToCart,
  withAddToWishList,
  withDeleteBtn,
  withAddMore,
  imgWidth,
  withQty = true,
  TagName = "li",
  className,
}: Props) => {
  const dispatch = useDispatch();
  const { _id, imgs, title } = product;

  const { pathname } = useLocation();
  const { productCardCells } = useInitProductsCells();

  const filterdCells = (cells || productCardCells).filter((prop) => {
    if (withQty) return prop;
    if (!withQty && prop === "quantity") return;
    return prop;
  });

  const msgRef = useRef<TopMessageRefType>(null);
  const deleteProductBtnRef = useRef<HTMLButtonElement>(null);

  const { userCart, user } = useSelector((state) => state.user);
  const isInStock = +((product as ProductType).quantity || 0) > 0;

  // react query \\

  // add to cart
  const {
    mutate: addToCart,
    isPending: cartLoading,
    data: cartData,
    error: cartErrData,
  } = useAddToCart();

  // remove item from cart
  const {
    mutate: removeFromCart,
    data: newCart,
    isPending: removeFromCartLoading,
    error: removeFromCartErrData,
    isError: removeFromCartErr,
  } = useMutation({
    mutationKey: ["removeItemFromCart", _id],
    mutationFn: removeItemFromCartMutationFn,
  });

  // add to wishlist
  const {
    toggleFromWishlist,
    data: finalUser,
    isError: wishlistErr,
    error: wishlistErrData,
    isPending: wishlistLoading,
  } = useToggleFromWishlist(_id);

  // useEffects \\

  useEffect(() => {
    if (wishlistErr)
      handleError(
        wishlistErrData,
        msgRef,
        {
          forAllStates:
            "something went wrong while adding the product to wishlist",
        },
        4000
      );
  }, [wishlistErr, wishlistErrData]);

  useEffect(() => {
    if (finalUser) dispatch(setUser(finalUser));
  }, [finalUser, dispatch]);

  useEffect(() => {
    if (cartData) dispatch(setCart(cartData));
    if (cartErrData)
      handleError(cartErrData, msgRef, {
        forAllStates: "something went wrong while adding product to cart",
      });
  }, [cartData, cartErrData, dispatch]);

  // set new cart after deleting item from it
  useEffect(() => {
    if (newCart) {
      if ("msg" in newCart) dispatch(resteCart(newCart.msg));
      else dispatch(setCart(newCart));
    }

    if (removeFromCartErr)
      handleError(removeFromCartErrData, msgRef, {
        forAllStates:
          "something went wrong while removing the item from your cart",
      });
  }, [dispatch, newCart, removeFromCartErr, removeFromCartErrData]);

  // spinners
  useEffect(() => {
    deleteProductBtnRef.current?.classList.toggle(
      "active",
      wishlistLoading || removeFromCartLoading
    );
  }, [wishlistLoading, removeFromCartLoading]);

  return (
    <>
      <TagName
        key={_id}
        className={`product-card${className ? ` ${className}` : ""}`}
      >
        {withAddToWishList && (
          <>
            {user ? (
              <button
                title="add to wishlist btn"
                disabled={wishlistLoading}
                className={`add-to-wishlist${
                  user?.wishlist.find((prdId) => prdId === _id) ? " active" : ""
                }`}
                onClick={toggleFromWishlist}
              >
                {wishlistLoading ? (
                  <EmptySpinner settings={{ diminsions: "20px" }} />
                ) : (
                  <FillIcon fill={<FaHeart />} stroke={<FaRegHeart />} />
                )}
              </button>
            ) : (
              <Link
                title="add product to wishlist btn"
                className="add-to-wishlist"
                to="/login"
                relative="path"
              >
                <FillIcon fill={<FaHeart />} stroke={<FaRegHeart />} />
              </Link>
            )}
          </>
        )}

        <ImgsSlider imgWidth={imgWidth || "150px"} imgs={imgs} />

        <div className="product-data-big-holder">
          <strong className="product-card-title">{title}</strong>

          {filterdCells.map((prop) => {
            if (withAddMore && prop === "count") {
              return (
                <ProductCardQtyList
                  addToCart={addToCart}
                  cartLoading={cartLoading}
                  product={product}
                  propName={prop}
                  key={prop}
                />
              );
            }

            return (
              <PropCell
                key={prop}
                name={prop}
                val={
                  product[prop as keyof typeof product]?.toString() +
                  (prop === "price" ? "$" : "")
                }
              />
            );
          })}

          <div className="product-card-btns-holder">
            <Link
              title="go to single product page btn"
              relative="path"
              to={`${
                pathname.includes("dashboard") ? "/dashboard" : ""
              }/product/${_id}`}
              className="product-card-more-info btn"
            >
              more info
            </Link>

            {/* if user not loged in and wan't to put item into cart => redirect him to login page */}
            {withAddToCart && !user && (
              <Link
                title="go to login before add to cart btn"
                to="/login"
                className="btn"
                relative="path"
                data-disabled={!isInStock}
              >
                {isInStock ? "add to cart" : "sold out"}
              </Link>
            )}

            {withAddToCart &&
              user &&
              (userCart?.products.find((prd) => prd._id === _id) ? (
                <Link
                  title="go to your cart btn"
                  className="btn"
                  to="/cart"
                  relative="path"
                >
                  show cart
                </Link>
              ) : (
                <button
                  title="add to cart btn"
                  onClick={() =>
                    addToCart({
                      productId: product._id,
                      count: 1,
                    })
                  }
                  disabled={cartLoading || !isInStock}
                  className={`btn${
                    cartLoading ? " center spinner-pseudo-after active" : ""
                  }`}
                >
                  {isInStock ? "add to cart" : "sold out"}
                </button>
              ))}
          </div>
        </div>

        {withDeleteBtn && (
          <button
            title="remove product from cart red btn"
            ref={deleteProductBtnRef}
            disabled={wishlistLoading || removeFromCartLoading}
            className="red-btn delete-product-btn"
            onClick={() => {
              if (withDeleteBtn === "cart") removeFromCart(_id);
              else toggleFromWishlist();
            }}
          >
            {wishlistLoading || removeFromCartLoading ? (
              <EmptySpinner settings={{ diminsions: "16px" }} />
            ) : (
              <FillIcon stroke={<AiOutlineDelete />} fill={<AiFillDelete />} />
            )}
          </button>
        )}
      </TagName>

      <TopMessage ref={msgRef} />
    </>
  );
};
export default ProductCard;
