// react
import { useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

// react query
import { useMutation } from "@tanstack/react-query";

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
import FillIcon from "../FillIcon";
import ProductCardQtyList from "./ProductCardQtyList";
import IconAndSpinnerSwitcher from "../animatedBtns/IconAndSpinnerSwitcher";
import ProductCardAddToCartBtn from "../AddProductToCartBtn";
import TopMessage, { type TopMessageRefType } from "../TopMessage";

// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineDelete, AiFillDelete } from "react-icons/ai";

// utils
import handleError from "../../utiles/functions/handleError";
import axios from "../../utiles/axios";

// types
import type { OrderProductType, ProductType } from "../../utiles/types";

// hooks
import useInitProductsCells from "../../hooks/useInitProductsCells";
import useToggleFromWishlist from "../../hooks/ReactQuery/useToggleFromWishlist";

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
  return (await axios.delete("/carts/cartProduct/" + prdId)).data;
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

  // react router dom
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  // hooks
  const { productCardCells } = useInitProductsCells();

  const filterdCells = (cells || productCardCells).filter((prop) => {
    if (withQty) return prop;
    if (!withQty && prop === "quantity") return;
    return prop;
  });

  const msgRef = useRef<TopMessageRefType>(null);

  const { user } = useSelector((state) => state.user);

  // react query \\

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

  // set new cart after deleting item from it
  useEffect(() => {
    if (newCart) {
      if ("msg" in newCart) dispatch(resteCart(newCart.msg));
      else {
        console.log(newCart);

        dispatch(setCart(newCart));
      }
    }

    if (removeFromCartErr)
      handleError(removeFromCartErrData, msgRef, {
        forAllStates:
          "something went wrong while removing the item from your cart",
      });
  }, [dispatch, newCart, removeFromCartErr, removeFromCartErrData]);

  return (
    <>
      <TagName
        key={_id}
        className={`product-card${className ? ` ${className}` : ""}`}
      >
        {withAddToWishList &&
          !isDashboard &&
          (user ? (
            <button
              title="add to wishlist btn"
              disabled={wishlistLoading}
              className={`add-to-wishlist`}
              onClick={toggleFromWishlist}
            >
              <IconAndSpinnerSwitcher
                toggleIcon={wishlistLoading}
                icon={
                  <FillIcon
                    className={
                      user?.wishlist.some((prdId) => prdId === _id)
                        ? " active"
                        : ""
                    }
                    fill={<FaHeart />}
                    stroke={<FaRegHeart />}
                  />
                }
              />
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
          ))}

        <ImgsSlider imgWidth={imgWidth || "150px"} imgs={imgs} />

        <div className="product-data-big-holder">
          <strong className="product-card-title">{title}</strong>

          {filterdCells.map((prop) => {
            if (withAddMore && prop === "count") {
              return (
                <ProductCardQtyList
                  msgRef={msgRef}
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
              to={`${isDashboard ? "/dashboard" : ""}/product/${_id}`}
              className="product-card-more-info btn"
            >
              more info
            </Link>

            {withAddToCart && (
              <ProductCardAddToCartBtn
                msgRef={msgRef}
                productId={product._id}
                productQty={(product as ProductType).quantity}
              />
            )}
          </div>
        </div>

        {withDeleteBtn && (
          <button
            title="remove product from cart red btn"
            disabled={wishlistLoading || removeFromCartLoading}
            className="red-btn delete-product-btn"
            onClick={() => {
              if (withDeleteBtn === "cart") removeFromCart(_id);
              else toggleFromWishlist();
            }}
          >
            <IconAndSpinnerSwitcher
              toggleIcon={wishlistLoading || removeFromCartLoading}
              icon={
                <FillIcon
                  stroke={<AiOutlineDelete />}
                  fill={<AiFillDelete />}
                />
              }
            />
          </button>
        )}
      </TagName>

      <TopMessage ref={msgRef} />
    </>
  );
};
export default ProductCard;
