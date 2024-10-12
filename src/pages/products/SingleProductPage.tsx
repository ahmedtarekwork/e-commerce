// react
import { useEffect, useRef, useState } from "react";

// react-router-dom
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

// redux
import useSelector from "../../hooks/redux/useSelector";
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import { setUserWishlist } from "../../store/fetures/userSlice";
import { removeProduct } from "../../store/fetures/productsSlice";

// react query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// components
import ImgsSlider from "../../components/ImgsSlider";
import PropCell from "../../components/PropCell";
import FillIcon from "../../components/FillIcon";
import SplashScreen from "../../components/spinners/SplashScreen";
import DisplayError from "../../components/layout/DisplayError";
import EmptyPage from "../../components/layout/EmptyPage";
import InsightWrapper from "../../components/InsightWrapper";
import AddProductToCartBtn from "../../components/AddProductToCartBtn";
import IconAndSpinnerSwitcher from "../../components/animatedBtns/IconAndSpinnerSwitcher";

import AreYouSureModal, {
  type SureModalRef,
} from "../../components/modals/AreYouSureModal";

// utils
import axios from "../../utils/axios";
import getAppColors from "../../utils/functions/getAppColors";
import activeFillIcon from "../../utils/activeFillIcon";

// charts.js
import { Chart as ChartJS, Legend, Tooltip, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import chartDataLabel from "chartjs-plugin-datalabels";

// hooks
import useToggleFromWishlist from "../../hooks/ReactQuery/useToggleFromWishlist";
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";

// types
import type { ChartDataType, ProductType } from "../../utils/types";

// icons
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiBallPenFill, RiBallPenLine } from "react-icons/ri";
import { BsTrash3, BsTrash3Fill } from "react-icons/bs";

// SVGs
import IdRequired from "../../../imgs/ID_required.svg";

// layouts
import AnimatedLayout from "../../layouts/AnimatedLayout";

ChartJS.register(Legend, Tooltip, ArcElement);

// fetchers
const getSingleProductQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: string[];
}) => {
  if (!id) throw new Error("product id is required");
  return (await axios("products/" + id)).data;
};

const deleteProductMutationFn = async (productId: string) => {
  return (await axios.delete("products/" + productId)).data;
};

const SingleProductPage = () => {
  const queryClient = useQueryClient();

  // react router
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  // hooks
  const handleError = useHandleErrorMsg();

  // refs
  const sureToDeleteModalRef = useRef<SureModalRef>(null);

  // redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const isInWishlist = useSelector((state) =>
    state.user.user?.wishlist?.some((prdId: string) => prdId === id)
  );

  // states
  const [product, setProduct] = useState<ProductType | undefined>(
    useSelector((state) =>
      state.products.products.find((prd) => prd._id === id)
    )
  );

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
  const { mutate: deleteProduct, isPending: isLoading } = useMutation({
    mutationKey: ["deleteProduct", id],
    mutationFn: deleteProductMutationFn,
    onSuccess() {
      if (id) dispatch(removeProduct(id));
      queryClient.prefetchQuery({ queryKey: ["getProducts"] });
      navigate(`${isDashboard ? "/dashboard" : ""}/products`, {
        relative: "path",
      });
    },
    onError(error) {
      handleError(
        error,
        {
          forAllStates: "something went wrong while deleting the product",
        },
        5000
      );
    },
  });

  // toggle from wishlist
  const { toggleFromWishlist, isPending: wishlistLoading } =
    useToggleFromWishlist(
      id || "",

      (data: string[]) => {
        dispatch(setUserWishlist(data));
      },

      (error: unknown) => {
        handleError(error, {
          forAllStates: "something went wrong while doing this proccess",
        });
      }
    );

  // get product if it's not found in app state
  useEffect(() => {
    if (!product) getProduct();
  }, []);

  // get product
  useEffect(() => {
    if (resProduct) setProduct(resProduct);
  }, [resProduct]);

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

  const soldedUnitsData = (): ChartDataType<"doughnut"> => {
    return {
      labels: ["Solded", "Not Solded"],
      datasets: [
        {
          hoverBorderColor: getAppColors(["--dark"]),
          backgroundColor: getAppColors(["--dark", "--trans"]),
          data: [sold, quantity],
        },
      ],
    };
  };

  return (
    <AnimatedLayout>
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
          <h1 className="single-product-title">{title}</h1>
          <PropCell
            name="brand"
            valueAsLink={
              brand?.name
                ? {
                    path: `/products?brand=${brand?.name || "not specified"}`,
                  }
                : undefined
            }
            val={
              brand?.name || (
                <span style={{ color: "var(--danger)", fontWeight: 500 }}>
                  not specified
                </span>
              )
            }
          />
          <PropCell name="price" val={price + "$"} />
          <PropCell
            className="single-product-color"
            name="color"
            val={
              <span
                style={{
                  filter: "invert(1)",
                  mixBlendMode: "difference",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  width: "fit-content",
                }}
              >
                {color}
              </span>
            }
            propNameProps={{
              style: {
                backgroundColor: color,
                padding: "5px 15px",
                flex: "unset",
                border: "var(--brdr)",
                borderRadius: 4,
                boxShadow: "var(--bx-shadow)",
              },
            }}
          />
          <PropCell
            name="category"
            val={
              category?.name || (
                <span style={{ color: "var(--danger)", fontWeight: 500 }}>
                  not specified
                </span>
              )
            }
            valueAsLink={
              category?.name
                ? {
                    path: `/products?category=${
                      category?.name || "not specified"
                    }`,
                  }
                : undefined
            }
          />
          <PropCell
            name="quantity"
            val={
              <>
                <span className="single-product-quantity-number">
                  {quantity.toString()}
                </span>{" "}
                units
              </>
            }
          />

          <PropCell
            className="single-product-description"
            name="description"
            val={description}
          />
        </div>
      </div>

      {isDashboard && (
        <ul className="single-product-page-insights-list">
          <InsightWrapper title="Solded Units Count" diminsion="900px">
            <Doughnut
              data={soldedUnitsData()}
              options={{
                aspectRatio: 2,
                plugins: {
                  datalabels: {
                    color: ["white", getAppColors(["--dark"])[0]],
                    font: {
                      weight: "bold",
                      size: 20,
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              plugins={[chartDataLabel as any]}
            />
          </InsightWrapper>
        </ul>
      )}

      <div className="single-product-btns">
        {isDashboard ? (
          <>
            <button
              title="open modal for delete product"
              className="red-btn delete-single-product"
              disabled={isLoading}
              onClick={() => sureToDeleteModalRef.current?.setOpenModal(true)}
              {...activeFillIcon}
            >
              <IconAndSpinnerSwitcher
                toggleIcon={isLoading}
                icon={
                  <FillIcon stroke={<BsTrash3 />} fill={<BsTrash3Fill />} />
                }
              />
              delete
            </button>

            <Link
              title="go to edit product page"
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
            <AddProductToCartBtn productId={id} productQty={quantity} />

            {/* toggle from wishlist btn */}
            {user && (
              <button
                title="toggle product from wishlist"
                className="btn"
                onClick={toggleFromWishlist}
                disabled={wishlistLoading}
                {...activeFillIcon}
              >
                <IconAndSpinnerSwitcher
                  toggleIcon={wishlistLoading}
                  icon={
                    isInWishlist ? (
                      <FaHeart />
                    ) : (
                      <FillIcon
                        diminsions={21}
                        stroke={<FaRegHeart />}
                        fill={<FaHeart />}
                      />
                    )
                  }
                />

                {isInWishlist ? "Remove from wishlist" : "add to wishlist"}
              </button>
            )}
            {!user && (
              <Link to="/login" relative="path" className="btn">
                <FillIcon
                  diminsions={21}
                  stroke={<FaRegHeart />}
                  fill={<FaHeart />}
                />
                add to wishlist
              </Link>
            )}
          </>
        )}
      </div>

      <AreYouSureModal
        ref={sureToDeleteModalRef}
        toggleClosingFunctions
        functionToMake={() => {
          deleteProduct(id);
          sureToDeleteModalRef.current?.setOpenModal(false);
        }}
      >
        Are You sure you want to delete "
        <span style={{ color: "var(--danger)", fontWeight: "bold" }}>
          {product.title}
        </span>
        " product ?
      </AreYouSureModal>
    </AnimatedLayout>
  );
};
export default SingleProductPage;
