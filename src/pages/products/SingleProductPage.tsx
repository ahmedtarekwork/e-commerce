// react
import { useEffect, useRef, useState } from "react";

// react-router-dom
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import useDispatch from "../../hooks/useDispatch";
// redux actions
import { setCart, setUser } from "../../store/fetures/userSlice";

// react query
import { useMutation, useQuery } from "@tanstack/react-query";

// components
import ImgsSlider from "../../components/ImgsSlider";
import PropCell from "../../components/PropCell";
import TopMessage, { TopMessageRefType } from "../../components/TopMessage";
import FillIcon from "../../components/FillIcon";
import SplashScreen from "../../components/spinners/SplashScreen";

// utiles
import axios, { axiosWithToken } from "../../utiles/axios";
import handleError from "../../utiles/functions/handleError";

// types
import { ProductType, RootStateType } from "../../utiles/types";

// icons
import {
  PiShoppingCartSimpleFill,
  PiShoppingCartSimpleLight,
} from "react-icons/pi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiBallPenFill, RiBallPenLine } from "react-icons/ri";

// hooks
import useAddToCart from "../../hooks/CartRequest/useAddToCart";
import useToggleFromWishlist from "../../hooks/useToggleFromWishlist";

// fetchers
const getSingleProductQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: string[];
}) => {
  if (!id) throw new Error("product id is required");
  return (await axiosWithToken("products/" + id)).data;
};

const deleteProductMutationFn = async (productId: string) => {
  return (await axiosWithToken.delete("products/" + productId)).data;
};

const SingleProductPage = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  // refs
  const msgRef = useRef<TopMessageRefType>(null);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);
  const toggleWishlistBtnRef = useRef<HTMLButtonElement>(null);

  const { user } = useSelector((state: RootStateType) => state.user);

  const isInCart = useSelector((state: RootStateType) =>
    state.user.userCart?.products?.some((prd) => prd._id === id)
  );

  const isInWishlist = useSelector((state: RootStateType) =>
    state.user.user?.wishlist?.some((prdId: string) => prdId === id)
  );

  const [product, setProduct] = useState<ProductType | undefined>(
    useSelector((state: RootStateType) =>
      state.products.products.find((prd) => prd._id === id)
    )
  );
  const isInStock = +(product?.quantity || 0) > 0;

  // get product
  const {
    refetch: getProduct,
    data: resProduct,
    isError: prdErr,
    error: prdErrData,
    isPending: prdLoading,
    fetchStatus,
  } = useQuery({
    queryKey: ["getProduct", id || ""],
    queryFn: getSingleProductQueryFn,
    enabled: false,
  });

  // delete product
  const {
    mutate: deleteProduct,
    isSuccess,
    isPending: isLoading,
    error,
    isError,
  } = useMutation({
    mutationKey: ["deleteProduct", id],
    mutationFn: deleteProductMutationFn,
  });

  // add product to cart
  const {
    mutate: addToCart,
    data: newCart,
    error: addToCartErrData,
    isPending: addToCartLoading,
  } = useAddToCart();

  // toggle from wishlist
  const {
    toggleFromWishlist,
    data: finalUser,
    error: wishlistErrData,
    isPending: wishlistLoading,
  } = useToggleFromWishlist(id || "");

  // get product if it's not found in app state
  useEffect(() => {
    if (!product) getProduct();
  }, []);

  // get product
  useEffect(() => {
    if (resProduct) setProduct(resProduct);
  }, [resProduct]);

  // delete product
  useEffect(() => {
    if (isSuccess) navigate("/products", { relative: "path" });

    if (isError)
      handleError(
        error,
        msgRef,
        {
          forAllStates: "something went wrong while deleting the product",
        },
        5000
      );
  }, [isError, error, isSuccess, navigate]);

  // add to cart
  useEffect(() => {
    if (newCart) dispatch(setCart(newCart));

    if (addToCartErrData)
      handleError(addToCartErrData, msgRef, {
        forAllStates: "something went wrong while adding the product to cart",
      });
  }, [addToCartErrData, newCart, dispatch]);

  // toggle productfrom wishlist
  useEffect(() => {
    if (finalUser) dispatch(setUser(finalUser));

    if (wishlistErrData)
      handleError(wishlistErrData, msgRef, {
        forAllStates: "something went wrong while doing this proccess",
      });
  }, [finalUser, wishlistErrData, dispatch]);

  // toggle spinners
  useEffect(() => {
    addToCartBtnRef.current?.classList.toggle("active", addToCartLoading);
  }, [addToCartLoading]);
  useEffect(() => {
    toggleWishlistBtnRef.current?.classList.toggle("active", wishlistLoading);
  }, [wishlistLoading]);

  if (!id) return <h1>id not found !</h1>;

  if (prdLoading && fetchStatus !== "idle")
    return <SplashScreen>Loading the Product...</SplashScreen>;

  if (prdErr) {
    let msg = "something went wrong while getting the product";
    if (axios.isAxiosError(prdErrData))
      msg = prdErrData.response?.data.message || prdErrData.response?.data;

    return <h1>{msg}</h1>;
  }

  if (!product) return <h1>product with id: "{id}" not found!</h1>;

  const {
    brand,
    category,
    color,
    imgs,
    price,
    quantity,
    title,
    sold,
    description,
    // ratings,
    // totalRating,
  } = product;

  return (
    <>
      <div className="single-product-top-holder">
        <div className="single-product-wrapper">
          <ImgsSlider imgWidth="400px" imgs={imgs} />

          <div className="single-product-data">
            <h3>{title}</h3>
            <PropCell name="brand" val={brand} />
            <PropCell name="price" val={price + "$"} />
            <PropCell
              className="single-product-color"
              name="color"
              val={""}
              propNameProps={{
                style: {
                  background: color,
                },
              }}
            />
            <PropCell name="category" val={category} />
            <PropCell
              className="single-product-description"
              name="description"
              val={description}
            />
          </div>
        </div>

        <div className="single-product-insights">
          <PropCell name="quantity" val={quantity.toString()} />

          {isDashboard && (
            <PropCell name="has solded" val={(sold || 0) + " units"} />
          )}
        </div>

        <div className="single-product-btns">
          {isDashboard ? (
            <>
              <button
                className="red-btn"
                disabled={isLoading}
                onClick={() => deleteProduct(id)}
              >
                delete
              </button>
              <Link
                to={`/dashboard/edit-product/${id}`}
                relative="path"
                className="btn"
                data-disabled={isLoading}
              >
                edit
              </Link>
            </>
          ) : (
            <>
              {user ? (
                <button
                  ref={addToCartBtnRef}
                  className={`btn${
                    addToCartLoading
                      ? " center spinner-pseudo-after fade scale"
                      : ""
                  }`}
                  disabled={addToCartLoading || !isInStock}
                  onClick={() => {
                    if (!isInCart) {
                      addToCart({
                        productId: id,
                        count: 1,
                      });
                    }
                  }}
                >
                  <FillIcon
                    diminsions={23}
                    stroke={<PiShoppingCartSimpleLight />}
                    fill={<PiShoppingCartSimpleFill />}
                  />
                  {isInCart
                    ? "show cart"
                    : `${!isInStock ? "add to cart" : "sold out"}`}
                </button>
              ) : (
                <Link
                  to="/login"
                  relative="path"
                  data-disabled={!isInStock}
                  className="btn"
                >
                  {isInStock ? "add to cart" : "sold out"}
                </Link>
              )}

              <button
                className={`btn${
                  wishlistLoading
                    ? " center spinner-pseudo-after fade scale"
                    : ""
                }`}
                ref={toggleWishlistBtnRef}
                onClick={toggleFromWishlist}
                disabled={wishlistLoading}
              >
                {isInWishlist ? (
                  <>
                    <FaHeart />
                    Remove from wishlist
                  </>
                ) : (
                  <>
                    <FillIcon
                      diminsions={21}
                      stroke={<FaRegHeart />}
                      fill={<FaHeart />}
                    />
                    add to wishlist
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {user?.isAdmin && !isDashboard && (
          <Link
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            className="btn"
            to={"/dashboard/product/" + product._id}
            relative="path"
          >
            <FillIcon
              diminsions={20}
              stroke={<RiBallPenLine />}
              fill={<RiBallPenFill />}
            />
            Edit this product
          </Link>
        )}
      </div>

      <TopMessage ref={msgRef} />
    </>
  );
};
export default SingleProductPage;
