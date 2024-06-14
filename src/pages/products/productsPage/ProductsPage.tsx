// react
import { type ComponentProps, useEffect, useState, useRef } from "react";

// react-router-dom
import {
  Link,
  useLocation,
  // useSearchParams
} from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useSelector from "../../../hooks/redux/useSelector";
import useDispatch from "../../../hooks/redux/useDispatch";
// redux actions
import {
  addProducts,
  addToPaginatedProducts,
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

import ProductsPageFilterCell, {
  type ProductsPageFilterCellRefType,
} from "./components/ProductsPageFilterCell";

import SidebarWrapper, {
  type SidebarWraperComponentRefType,
} from "../../../components/layout/SidebarWrapper";

import ProductsPageSearch from "./components/ProductsPageSearch";

// hooks
import useInitProductsCells from "../../../hooks/useInitProductsCells";
import useGetCategories from "../../../hooks/ReactQuery/useGetCategories";

// utils
import { axiosWithToken } from "../../../utiles/axios";

// types
import type { ProductType } from "../../../utiles/types";

// icons
import { RiFilterLine, RiFilterFill } from "react-icons/ri";

// SVGs
import makeNewProductSvg from "../../../../imgs/make.svg";
import NoSearchResault from "../../../../imgs/no-search-resault.svg";

type getProductsQueryFnType = (params: {
  queryKey: [string, number, number, string];
}) => Promise<{ products: ProductType[]; pagesCount: number }>;

// fetchers
const getProductsQueryFn: getProductsQueryFnType = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, page, limit, titleStartsWith],
}) => {
  return (
    await axiosWithToken.get(
      `products?limit=${limit}&page=${page}&titleStartsWith=${titleStartsWith.replaceAll(
        `\\`,
        ""
      )}`
    )
  ).data;
};

// make new product btn
const GoToMakeNewBtn = ({ ...attr }: ComponentProps<"a">) => (
  <Link
    title="make a new product btn"
    to="/dashboard/new-product"
    relative="path"
    {...attr}
    className={`btn${attr.className ? ` ${attr.className}` : ""}`}
  >
    make a new product
  </Link>
);

const ProductsPage = () => {
  // react router dom
  // const [searchParams] = useSearchParams();
  // const category = searchParams.get("category");
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  // console.log(category);

  // refs
  const initRender = useRef(true);
  const searchQuery = useRef("");
  const filtersListRef = useRef<SidebarWraperComponentRefType>(null);
  const catsListRef = useRef<ProductsPageFilterCellRefType>(null);
  const openFiltersBtnRef = useRef<HTMLButtonElement>(null);

  // redux and global states
  const dispatch = useDispatch();
  const { pagenatedProducts: products, products: productsList } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.user);
  const { listCell } = useInitProductsCells();

  const limit = 3;
  const [page, setPage] = useState(1);
  const [searchPorducts, setSearchProducts] = useState<ProductType[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [filtersListCloseList, setFiltersListCloseList] = useState<
    (HTMLElement | null)[]
  >([]);

  // get products
  const {
    data: apiProducts,
    refetch: getProducts,
    isPending: loading,
    isError,
    isSuccess,
    fetchStatus,
  } = useQuery({
    queryKey: ["getProducts", page, limit, searchQuery.current],
    queryFn: getProductsQueryFn,
  });
  const noSearchResault = searchMode && !searchPorducts.length && !loading;

  // get categories
  const { data: categories, isPending: categoriesLoading } = useGetCategories();

  useEffect(() => {
    setFiltersListCloseList([openFiltersBtnRef.current]);
  }, []);

  useEffect(() => {
    getProducts();
  }, [page, limit, searchMode]); // don't change dependencies array

  useEffect(() => {
    if (!initRender) setPage(1);
  }, [searchMode]);

  useEffect(() => {
    if (apiProducts) {
      if (initRender.current) initRender.current = false;

      if (!searchMode) {
        dispatch(
          addToPaginatedProducts({
            page,
            products: apiProducts.products,
          })
        );
      } else {
        setSearchProducts(apiProducts.products);
      }

      dispatch(addProducts(apiProducts.products));
    }
  }, [apiProducts, dispatch, page, searchMode]);

  if (isError)
    return (
      <DisplayError
        error={null}
        initMsg="something went wrong while displaying products"
      />
    );

  // if no products
  if (!productsList.length && isSuccess && !searchMode) {
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
                btn: <GoToMakeNewBtn style={{ marginInline: "auto" }} />,
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
  };

  // if there are products
  return (
    <>
      <div className="section">
        <Heading content="Products List" />
        {isDashboard && user?.isAdmin && (
          <GoToMakeNewBtn style={{ marginBottom: 10 }} />
        )}
      </div>

      <button
        title="open products filters list btn"
        className="btn open-filters-btn"
        onClick={() => filtersListRef.current?.setToggleSidebar(true)}
        ref={openFiltersBtnRef}
      >
        <FillIcon stroke={<RiFilterLine />} fill={<RiFilterFill />} />
        Filters
      </button>

      <ProductsPageSearch onChangeFn={onSearchValueChangeFn} />

      {fetchStatus !== "idle" && loading ? (
        <div className="products-page-spinner">
          <Spinner
            fullWidth={true}
            settings={{ clr: "var(--main)" }}
            style={{
              color: "var(--main)",
              height: "100%",
            }}
          >
            <strong> Loading Products...</strong>
          </Spinner>
        </div>
      ) : (
        <>
          {noSearchResault ? (
            <EmptyPage
              centerPage={false}
              content="No products with your search"
              svg={NoSearchResault}
            />
          ) : (
            <GridList
              isChanging={false}
              cells={listCell}
              initType="column"
              className="product-page-products-list"
            >
              {(searchMode ? searchPorducts : products[page])?.map(
                (product) => (
                  <ProductCard
                    withAddToWishList
                    key={product._id}
                    product={product}
                    withAddToCart={!isDashboard}
                  />
                )
              )}
            </GridList>
          )}
        </>
      )}

      {!noSearchResault && (
        <Pagination
          activePage={page}
          pagesCount={apiProducts?.pagesCount}
          setActivePage={setPage}
        />
      )}

      <SidebarWrapper
        insideClose={false}
        ref={filtersListRef}
        closeList={{
          reversedList: filtersListCloseList,
        }}
        id="filters-list-sidebar"
      >
        <ul className="products-page-filters-list">
          <ProductsPageFilterCell
            ref={catsListRef}
            optionsList={categories}
            title="Categories"
            type="check-list"
            loading={true}
          />
        </ul>
      </SidebarWrapper>
    </>
  );
};

export default ProductsPage;
