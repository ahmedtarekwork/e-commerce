// react
import { useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

// react query
import { useMutation, useQuery } from "@tanstack/react-query";

// redux
import { useSelector } from "react-redux";
import useDispatch from "../hooks/useDispatch";
// redux actions
import {
  setUser,
  // user cart
  setCart,
  resteCart,
} from "../store/fetures/userSlice";

// components
import ImgsSlider from "./ImgsSlider";
import PropCell from "./PropCell";
import TopMessage, { TopMessageRefType } from "./TopMessage";
import FillIcon from "./FillIcon";
import EmptySpinner from "./spinners/EmptySpinner";
import SelectList, { selectListOptionType } from "./selectList/SelectList";

// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiOutlineDelete, AiFillDelete } from "react-icons/ai";

// utiles
import handleError from "../utiles/functions/handleError";
import { axiosWithToken } from "../utiles/axios";

// types
import { OrderProductType, ProductType, RootStateType } from "../utiles/types";

// hooks
import useInitProductsCells from "../hooks/useInitProductsCells";
import useAddToCart from "../hooks/CartRequest/useAddToCart";
import useToggleFromWishlist from "../hooks/useToggleFromWishlist";

export type ProductCardDeleteBtn = {
  withDeleteBtn?: "cart" | "wishlist";
};

type Props = ProductCardDeleteBtn & {
  product: ProductType | OrderProductType;
  cells?: (keyof Partial<ProductType> | string)[];
  withAddToCart?: boolean;
  withAddToWishList?: boolean;
  withAddMore?: boolean;
};

// fetchers
const removeItemFromCartMutationFn = async (prdId: string) => {
  return (await axiosWithToken.delete("/carts/cartProduct/" + prdId)).data;
};

const getProductQtyQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, prdId],
}: {
  queryKey: string[];
}) => {
  return (await axiosWithToken("products/" + prdId)).data.quantity;
};

const ProductCard = ({
  product,
  cells,
  withAddToCart,
  withAddToWishList,
  withDeleteBtn,
  withAddMore,
}: Props) => {
  const dispatch = useDispatch();
  const { _id, imgs, title } = product;

  const { pathname } = useLocation();
  const { productCardCells } = useInitProductsCells();

  const itemRef = useRef<HTMLLIElement>(null);
  const msgRef = useRef<TopMessageRefType>(null);
  const deleteProductBtnRef = useRef<HTMLButtonElement>(null);

  const { userCart, user } = useSelector((state: RootStateType) => state.user);
  const isInStock = +((product as ProductType).quantity || 0) > 0;

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

  // get product qty
  const {
    refetch: getProductQty,
    data: resProductQty,
    isPending: productQtyLoading,
    isError: productQtyErr,
  } = useQuery({
    queryKey: ["getProductQty", _id],
    queryFn: getProductQtyQueryFn,
    enabled: false,
  });

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
      <li ref={itemRef} key={_id} className="product-card">
        {withAddToWishList && (
          <button
            disabled={wishlistLoading}
            className={`add-to-wishlist${
              user?.wishlist.find((prdId) => prdId === _id) ? " active" : ""
            }`}
            onClick={toggleFromWishlist}
          >
            {wishlistLoading ? (
              <EmptySpinner settings={{ diminsions: "12px" }} />
            ) : (
              <FillIcon fill={<FaHeart />} stroke={<FaRegHeart />} />
            )}
          </button>
        )}

        <ImgsSlider imgWidth="150px" imgs={imgs} />

        <div className="product-data-big-holder">
          <strong className="product-card-title">{title}</strong>

          {(cells || productCardCells).map((prop) => {
            if (withAddMore && prop === "count") {
              getProductQty();

              if (productQtyLoading)
                return (
                  <EmptySpinner key={prop} settings={{ diminsions: "10px" }} />
                );
              if (productQtyErr)
                return (
                  <PropCell
                    key={prop}
                    name={prop}
                    val={product[prop as keyof typeof product]?.toString()}
                  />
                );

              const list = Array.from({
                length: resProductQty,
              }).map((_, i) => ({
                selected: (product as OrderProductType).count === i + 1,
                text: i + 1,
              })) as unknown as selectListOptionType<`${number}`>[];

              return (
                <PropCell
                  key={prop}
                  name={prop}
                  val={
                    <SelectList
                      disabled={{
                        value: cartLoading,
                        text: "loading...",
                      }}
                      outOfFlow
                      optClickFunc={(e) => {
                        const value = e.currentTarget.dataset.opt;

                        if (value)
                          addToCart({
                            productId: _id,
                            count:
                              +value - +(product as OrderProductType).count,
                          });
                      }}
                      id={_id}
                      label=""
                      listOptsArr={list}
                    />
                  }
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
                <Link className="btn" to="/cart" relative="path">
                  show cart
                </Link>
              ) : (
                <button
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
      </li>

      <TopMessage ref={msgRef} />
    </>
  );
};
export default ProductCard;
