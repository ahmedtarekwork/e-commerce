// react
import { useEffect, useRef, useState } from "react";

// react-router-dom
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

// redux
import useSelector from "../../hooks/redux/useSelector";
import useDispatch from "../../hooks/redux/useDispatch";
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
import DisplayError from "../../components/layout/DisplayError";
import EmptyPage from "../../components/layout/EmptyPage";
import AreYouSureModal from "../../components/modals/AreYouSureModal";

// utiles
import { axiosWithToken } from "../../utiles/axios";
import handleError from "../../utiles/functions/handleError";

// hooks
import useAddToCart from "../../hooks/ReactQuery/CartRequest/useAddToCart";
import useToggleFromWishlist from "../../hooks/ReactQuery/useToggleFromWishlist";

// types
import type { ProductType } from "../../utiles/types";
import type { AppModalRefType } from "../../components/modals/appModal/AppModal";

// icons
import {
  PiShoppingCartSimpleFill,
  PiShoppingCartSimpleLight,
} from "react-icons/pi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiBallPenFill, RiBallPenLine } from "react-icons/ri";
import { BsTrash3, BsTrash3Fill } from "react-icons/bs";

// SVGs
import IdRequired from "../../../imgs/ID_required.svg";

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
  const sureToDeleteModalRef = useRef<AppModalRefType>(null);
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);
  const toggleWishlistBtnRef = useRef<HTMLButtonElement>(null);

  const { user } = useSelector((state) => state.user);

  const isInCart = useSelector((state) =>
    state.user.userCart?.products?.some((prd) => prd._id === id)
  );

  const isInWishlist = useSelector((state) =>
    state.user.user?.wishlist?.some((prdId: string) => prdId === id)
  );

  const [product, setProduct] = useState<ProductType | undefined>(
    useSelector((state) =>
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

  if (prdLoading && fetchStatus !== "idle")
    return <SplashScreen>Loading the Product...</SplashScreen>;

  if (prdErr) {
    return (
      <DisplayError
        error={prdErrData}
        initMsg="something went wrong while getting the product"
      />
    );
  }

  if (!product || !id) {
    return (
      <EmptyPage
        content={
          !id ? (
            "Product Id is required"
          ) : (
            <>
              No Product with Id: <br /> "{id}"
            </>
          )
        }
        svg={IdRequired}
        withBtn={{ type: "GoToHome" }}
      />
    );
  }

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
      {user?.isAdmin && !isDashboard && (
        <Link
          title="edit single product btn"
          className="btn go-to-edit-product-btn"
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
          <PropCell
            name="category"
            valueAsLink={{
              path: `/products?category=${category}`,
            }}
            val={category}
          />
          <PropCell name="quantity" val={quantity.toString()} />
          {isDashboard && (
            <PropCell name="has solded" val={(sold || 0) + " units"} />
          )}

          <PropCell
            className="single-product-description"
            name="description"
            val={description}
          />
        </div>
      </div>

      <div className="single-product-btns">
        {isDashboard ? (
          <>
            <button
              title="open modal for choosing delete product or not btn"
              className="red-btn delete-single-product"
              disabled={isLoading}
              onClick={() => sureToDeleteModalRef.current?.toggleModal(true)}
            >
              <FillIcon stroke={<BsTrash3 />} fill={<BsTrash3Fill />} />
              delete
            </button>

            <Link
              title="go to edit product page btn"
              to={`/dashboard/edit-product/${id}`}
              relative="path"
              className="btn"
              data-disabled={isLoading}
            >
              <FillIcon
                diminsions={20}
                stroke={<RiBallPenLine />}
                fill={<RiBallPenFill />}
              />
              edit
            </Link>
          </>
        ) : (
          <>
            {user ? (
              <>
                {isInCart ? (
                  <Link
                    title="go to cart btn"
                    to="/cart"
                    relative="path"
                    className="btn"
                  >
                    <FillIcon
                      diminsions={23}
                      stroke={<PiShoppingCartSimpleLight />}
                      fill={<PiShoppingCartSimpleFill />}
                    />
                    show cart
                  </Link>
                ) : (
                  <button
                    title="add to cart btn"
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
                    {isInStock ? "add to cart" : "sold out"}
                  </button>
                )}
              </>
            ) : (
              <Link
                title="go to login before add product to cart btn"
                to="/login"
                relative="path"
                data-disabled={!isInStock}
                className="btn"
              >
                {isInStock ? "add to cart" : "sold out"}
              </Link>
            )}

            <button
              title="toggle product from wishlist"
              className={`btn${
                wishlistLoading ? " center spinner-pseudo-after fade scale" : ""
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

      <AreYouSureModal
        ref={sureToDeleteModalRef}
        toggleClosingFunctions
        functionToMake={() => {
          deleteProduct(id);
          sureToDeleteModalRef.current?.toggleModal(false);
        }}
      >
        Are You sure you want to delete "
        <span style={{ color: "var(--danger)", fontWeight: "bold" }}>
          {product.title}
        </span>
        " product ?
      </AreYouSureModal>
      <TopMessage ref={msgRef} />
    </>
  );
};
export default SingleProductPage;
