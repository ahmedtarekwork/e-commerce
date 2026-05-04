// react-router-dom
import { Link, useLocation, useParams } from "react-router-dom";

// redux
import useSelector from "../../../hooks/redux/useSelector";
// redux actions

// react query
import { useQuery } from "@tanstack/react-query";

// components
import FillIcon from "../../../components/FillIcon";
import ImgsSlider from "../../../components/ImgsSlider";
import DisplayError from "../../../components/layout/DisplayError";
import EmptyPage from "../../../components/layout/EmptyPage";
import SplashScreen from "../../../components/spinners/SplashScreen";
import SingleProductPageProductInfo from "./components/SingleProductPageProductInfo";
import SingleProductPageSoldedUnits from "./components/SingleProductPageSoldedUnits";
import SingleProductPageDashboardBtns from "./components/SingleProductPageDashboardBtns";
import SingleProductPageNormalModeBtns from "./components/SingleProductPageNormalModeBtns";

// utils
import axios from "../../../utils/axios";

// charts.js
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

// types
import type { ProductType } from "../../../utils/types";

// icons
import { RiBallPenFill, RiBallPenLine } from "react-icons/ri";

// SVGs
import IdRequired from "../../../../imgs/ID_required.svg";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

ChartJS.register(Legend, Tooltip, ArcElement);

// fetchers
const getSingleProductQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: string[];
}) => {
  if (!id) throw new Error("product id is required");
  return (await axios("products/" + id)).data as ProductType;
};

const SingleProductPage = () => {
  // react router
  const { id } = useParams();
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  const { user } = useSelector((state) => state.user);

  // get product
  const {
    data: product,
    isError: prdErr,
    error: prdErrData,
    isPending: prdLoading,
    fetchStatus,
  } = useQuery({
    queryKey: ["getProduct", id || ""],
    queryFn: getSingleProductQueryFn,
  });

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

  const { imgs, quantity, sold, existsInCart, title } = product;

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
        <ImgsSlider
          imgWidth="400px"
          // TODO : REMOVE ZEROS AFTER CHANGE ALL PRODUCTS IMAGES IN THE APPLICATION
          imgs={imgs.slice().sort((a, b) => (a.order || 0) - (b.order || 0))}
        />

        <SingleProductPageProductInfo product={product} />
      </div>

      <SingleProductPageSoldedUnits
        isDashboard={isDashboard}
        quantity={quantity}
        sold={sold}
      />

      <div className="single-product-btns">
        {isDashboard ? (
          <SingleProductPageDashboardBtns title={title} />
        ) : (
          <SingleProductPageNormalModeBtns
            existsInCart={existsInCart}
            _id={id}
            quantity={quantity}
            user={user}
          />
        )}
      </div>
    </AnimatedLayout>
  );
};
export default SingleProductPage;
