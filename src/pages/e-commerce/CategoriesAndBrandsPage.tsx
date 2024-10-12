// react
import { useEffect } from "react";

// react router
import { Link, useLocation } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import { setCategoriesOrBrand } from "../../store/fetures/categoriesAndBrandsSlice";

// components
import Spinner from "../../components/spinners/Spinner";
import DisplayError from "../../components/layout/DisplayError";
import Heading from "../../components/Heading";
import CategoryAndBrandCard from "../../components/CategoryAndBrandCard";

// utils
import axios from "../../utils/axios";

// types
import type { CategoryAndBrandType } from "../../utils/types";

// framer motion
import { AnimatePresence } from "framer-motion";

type Props = {
  type: "categories" | "brands";
};

// fetchers
const getCategoriesOrBrandsQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, type],
}: {
  queryKey: string[];
}): Promise<CategoryAndBrandType[]> => {
  return (await axios(type)).data;
};

const CategoriesAndBrandsPage = ({ type }: Props) => {
  // redux
  const dispatch = useDispatch();

  // react router
  const { pathname } = useLocation();

  // constants
  const isDashboard = pathname.includes("dashboard");

  const {
    data: modelArr,
    isError,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: [`get ${type}`, type],
    queryFn: getCategoriesOrBrandsQueryFn,
  });

  useEffect(() => {
    if (modelArr) {
      dispatch(setCategoriesOrBrand({ type, categoriesOrBrands: modelArr }));
    }
  }, [modelArr]);

  if (isPending) {
    return <Spinner fullWidth>Loading {type}...</Spinner>;
  }

  if (isError) {
    return (
      <DisplayError
        error={error}
        initMsg={`somthing went wrong while display ${type}`}
      />
    );
  }

  return (
    <div
      style={
        !modelArr.length
          ? { display: "grid", placeContent: "center", height: "100%" }
          : {}
      }
    >
      {!!modelArr.length && (
        <>
          {isDashboard && (
            <Link
              className="btn"
              to={`/dashboard/${type}Form`}
              relative="path"
              style={{ marginBottom: 30 }}
            >
              + Add New {type}
            </Link>
          )}

          <Heading>Available {type}</Heading>

          <ul className="categories-or-brands-list">
            <AnimatePresence>
              {modelArr.map((modelData) => (
                <CategoryAndBrandCard
                  isDashboard={isDashboard}
                  modelData={modelData}
                  type={type}
                  refetchModels={refetch}
                />
              ))}
            </AnimatePresence>
          </ul>
        </>
      )}

      {!modelArr.length && (
        <div className="category-or-brand-no-data-holder">
          <strong>there aren't any {type} to display</strong>
          <Link className="btn" to={`/dashboard/${type}Form`} relative="path">
            + Add Some {type}
          </Link>
        </div>
      )}
    </div>
  );
};
export default CategoriesAndBrandsPage;
