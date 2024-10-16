// react
import { useEffect, useState, useRef } from "react";

// react-router-dom
import { useLocation, useSearchParams } from "react-router-dom";

// react query
import { useQuery, useQueryClient } from "@tanstack/react-query";

// redux
import useSelector from "../../../hooks/redux/useSelector";
import useDispatch from "../../../hooks/redux/useDispatch";
// redux actions
import {
  addProducts,
  resetProducts,
} from "../../../store/fetures/productsSlice";

// components
import Heading from "../../../components/Heading";
import GridList from "../../../components/gridList/GridList";
import ProductCard from "../../../components/productCard/ProductCard";
import DisplayError from "../../../components/layout/DisplayError";
import Pagination from "../../../components/Pagination";
import EmptyPage from "../../../components/layout/EmptyPage";
import Spinner from "../../../components/spinners/Spinner";
import FillIcon from "../../../components/FillIcon";
import ProductsPageSearch from "./components/ProductsPageSearch";
import GoToMakeNewProductsBtn from "./components/GoToMakeNewProductsBtn";

// filters list
import ProductsPageFiltersList, {
  type AvailabilityOption,
  type ProductsPageFiltersListRefType,
} from "./components/productsPageFilters/ProductsPageFiltersList";

// hooks
import useInitProductsCells from "../../../hooks/useInitProductsCells";

// utils
import axios from "../../../utils/axios";

// types
import type { ProductType } from "../../../utils/types";

// icons
import { RiFilterLine, RiFilterFill } from "react-icons/ri";
import { TbFilterStar } from "react-icons/tb";

// SVGs
import makeNewProductSvg from "../../../../imgs/make.svg";
import NoSearchResault from "../../../../imgs/no-search-resault.svg";
import NoFiltersResault from "../../../../imgs/no_Filters.svg";

// framer motion
import { AnimatePresence } from "framer-motion";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

export type FiltersListType = {
  categories?: string[] | undefined;
  brands?: string[] | undefined;
  priceRange?: Record<"min" | "max", number> | undefined;
  availability?: AvailabilityOption;
};

type getProductsQueryFnType = (params: {
  queryKey: [string, number, number, string, FiltersListType];
}) => Promise<{
  products: ProductType[];
  pagesCount: number;
  priceRange: Record<"min" | "max", number>;
}>;

// fetchers
const getProductsQueryFn: getProductsQueryFnType = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, page, limit, titleStartsWith, filtersList],
}) => {
  const searchOption = titleStartsWith.replaceAll(`\\`, "");
  const implementedSearchOption = searchOption
    ? `titleStartsWith=${searchOption}`
    : "";

  const filtersOption = Object.entries(filtersList)
    .filter((arr) => {
      if (Array.isArray(arr[1])) {
        return !!arr[1].length;
      } else return !!arr[1];
    })
    .map(([query, value]) => {
      if (query !== "priceRange") {
        return `${query}=${value}`;
      }
      if (query === "priceRange" && value) {
        return Object.entries(value)
          .map(
            ([key, price]) =>
              `price${key[0].toUpperCase() + key.slice(1)}=${price}`
          )
          .join("&");
      }
    })
    .join("&");

  return (
    await axios.get(
      `products?limit=${limit}&page=${page}&${implementedSearchOption}&${filtersOption}`
    )
  ).data;
};

const ProductsPage = () => {
  const queryClient = useQueryClient();
  const { listCell } = useInitProductsCells();

  // react router dom
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const initCategories = category ? [category] : undefined;
  const initBrands = brand ? [brand] : undefined;

  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  // refs
  const initRender = useRef(true);
  const searchQuery = useRef("");
  const pagesCount = useRef<number | undefined>(undefined);

  const changeFiltersBtnRef = useRef<HTMLButtonElement>(null);

  const filtersListRef = useRef<ProductsPageFiltersListRefType>(null);

  const openFiltersBtnRef = useRef<HTMLButtonElement>(null);

  // redux and global states
  const dispatch = useDispatch();
  const { products: productsList } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);

  const limit = 10;
  const [paginatedProducts, setPaginatedProducts] = useState<
    Record<number, ProductType[]>
  >({});
  const [page, setPage] = useState(1);
  const [searchMode, setSearchMode] = useState(false);

  const [filtersList, setFiltersList] = useState<FiltersListType>({
    categories: initCategories,
    brands: initBrands,
  });

  // get products
  const {
    error,
    data: apiProducts,
    isPending: loading,
    isError,
    isSuccess,
    fetchStatus,
  } = useQuery({
    queryKey: ["getProducts", page, limit, searchQuery.current, filtersList],
    queryFn: getProductsQueryFn,
  });

  const noSearchResault =
    searchMode &&
    !Object.values(paginatedProducts).flat(Infinity).length &&
    !loading;

  const [noFiltersResault, setNoFiltersResault] = useState(
    (filtersList.brands?.length ||
      filtersList.categories?.length ||
      filtersList.priceRange) &&
      !searchMode &&
      !loading &&
      !Object.values(paginatedProducts).flat(Infinity).length
  );

  const [openFiltersListBtns, setOpenFiltersListBtns] = useState(
    [openFiltersBtnRef.current, changeFiltersBtnRef.current].filter((el) => el)
  );

  const changeOpenFiltersListBtnsList = () => {
    if (
      ![openFiltersBtnRef.current, changeFiltersBtnRef.current]
        .sort()
        .every((el, i) => {
          return el?.isEqualNode(openFiltersListBtns.sort()[i]);
        })
    ) {
      setOpenFiltersListBtns(
        [openFiltersBtnRef.current, changeFiltersBtnRef.current].filter(
          (el) => el
        )
      );
    }
  };

  useEffect(() => {
    if (
      (filtersList.brands?.length ||
        filtersList.categories?.length ||
        filtersList.priceRange) &&
      !searchMode &&
      !loading &&
      !Object.values(paginatedProducts).flat(Infinity).length
    ) {
      if (!noFiltersResault) setNoFiltersResault(true);

      changeOpenFiltersListBtnsList();
    } else {
      if (noFiltersResault) setNoFiltersResault(false);

      changeOpenFiltersListBtnsList();
    }
  }, [filtersList, searchMode, loading, paginatedProducts]);

  useEffect(() => {
    changeOpenFiltersListBtnsList();
  }, [noFiltersResault]);

  useEffect(() => {
    if (!initRender.current) {
      queryClient.prefetchQuery({
        queryKey: [
          "getProducts",
          page,
          limit,
          searchQuery.current,
          filtersList,
        ],
      });
    }
  }, [queryClient, filtersList, page, limit, searchMode]); // don't change dependencies array

  useEffect(() => {
    if (!apiProducts?.products.length && apiProducts?.pagesCount === 0) {
      setPaginatedProducts([]);
      dispatch(resetProducts());
    }

    if (apiProducts?.products.length) {
      if (initRender.current) initRender.current = false;
      pagesCount.current = apiProducts.pagesCount || 1;

      setPaginatedProducts((prev) => {
        if (filtersListRef.current?.isResetProductsRef.current) {
          filtersListRef.current.isResetProductsRef.current = false;
          return { [page]: apiProducts.products };
        }

        return {
          ...prev,
          [page]: apiProducts.products,
        };
      });

      dispatch(addProducts(apiProducts.products));
    }
  }, [apiProducts, dispatch, page]);

  if (isError)
    return (
      <DisplayError
        error={error}
        initMsg="something went wrong while displaying products"
      />
    );

  // if no products
  if (
    !productsList.length &&
    isSuccess &&
    !noSearchResault &&
    !noFiltersResault
  ) {
    return (
      <EmptyPage
        content={
          <>
            <h3>
              {isDashboard
                ? "No products to show"
                : "There aren't any products for now"}
            </h3>
            <strong>
              {isDashboard
                ? "add some products to display it here"
                : "We Will Add some products later"}
              .
            </strong>
          </>
        }
        svg={makeNewProductSvg}
        withBtn={
          isDashboard
            ? {
                type: "custom",
                btn: (
                  <GoToMakeNewProductsBtn style={{ marginInline: "auto" }} />
                ),
              }
            : {
                type: "GoToHome",
              }
        }
      />
    );
  }

  const onSearchValueChangeFn = (value: string) => {
    searchQuery.current = value;
    setSearchMode(!!searchQuery.current);
    setPage(1);
    setPaginatedProducts({});
  };

  return (
    <AnimatedLayout>
      <Heading>Products List</Heading>

      {isDashboard && user?.isAdmin && (
        <GoToMakeNewProductsBtn style={{ marginBottom: 10 }} />
      )}

      <button
        disabled={loading}
        title="open products filters list btn"
        className="btn open-filters-btn"
        onClick={() =>
          filtersListRef.current?.sidebarRef.current?.setToggleSidebar(true)
        }
        ref={openFiltersBtnRef}
      >
        <FillIcon stroke={<RiFilterLine />} fill={<RiFilterFill />} />
        Filters
      </button>

      <ProductsPageSearch onChangeFn={onSearchValueChangeFn} />

      <AnimatePresence mode="wait">
        {fetchStatus !== "idle" && loading ? (
          <AnimatedLayout className="products-page-spinner" key="one">
            <Spinner fullWidth={true}>Loading Products...</Spinner>
          </AnimatedLayout>
        ) : (
          <AnimatedLayout key="two">
            {noFiltersResault && (
              <EmptyPage
                centerPage={false}
                content="No products with your Filters"
                svg={NoFiltersResault}
                withBtn={{
                  type: "custom",
                  btn: (
                    <button
                      ref={changeFiltersBtnRef}
                      className="btn no-filters-resault-sidebar-toggler"
                      onClick={() =>
                        filtersListRef.current?.sidebarRef.current?.setToggleSidebar(
                          true
                        )
                      }
                    >
                      <TbFilterStar />
                      Edit Your Filters
                    </button>
                  ),
                }}
              />
            )}

            {noSearchResault && (
              <EmptyPage
                centerPage={false}
                content="No products with your search"
                svg={NoSearchResault}
              />
            )}

            {!noFiltersResault && !noSearchResault && (
              <GridList
                isChanging={false}
                cells={listCell}
                initType="column"
                className="product-page-products-list"
              >
                {paginatedProducts[page]?.map((product) => (
                  <ProductCard
                    withAddToWishList
                    key={product._id}
                    product={product}
                    withAddToCart={!isDashboard}
                  />
                ))}
              </GridList>
            )}
          </AnimatedLayout>
        )}
      </AnimatePresence>

      {!!apiProducts?.products.length && !loading && (
        <Pagination
          activePage={page}
          pagesCount={pagesCount.current}
          setActivePage={setPage}
        />
      )}

      <ProductsPageFiltersList
        ref={filtersListRef}
        setPage={setPage}
        sidebarCloseList={openFiltersListBtns}
        apiPriceRange={apiProducts?.priceRange}
        setFiltersList={setFiltersList}
        initCategories={initCategories}
        initBrands={initBrands}
        filtersList={filtersList}
      />
    </AnimatedLayout>
  );
};

export default ProductsPage;
