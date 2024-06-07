// react
import { useEffect } from "react";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

// redux
import useSelector from "../../hooks/redux/useSelector";
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import { setProducts } from "../../store/fetures/productsSlice";

// components
import Heading from "../../components/Heading";
import GridList from "../../components/gridList/GridList";
import ProductCard from "../../components/ProductCard";
import SplashScreen from "../../components/spinners/SplashScreen";
import DisplayError from "../../components/layout/DisplayError";

// hooks
import useInitProductsCells from "../../hooks/useInitProductsCells";
import useGetProducts from "../../hooks/ReactQuery/useGetProducts";

const GoToMakeNewBtn = () => (
  <Link className="btn" to="/dashboard/new-product" relative="path">
    make a new product
  </Link>
);

const ProductsPage = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname.includes("dashboard");

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);
  const { listCell } = useInitProductsCells();

  // get products
  const {
    data: apiProducts,
    refetch: getProducts,
    isPending: loading,
    isError,
    error,
    isFetching,
  } = useGetProducts();

  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    if (apiProducts) dispatch(setProducts(apiProducts));
  }, [apiProducts, dispatch]);

  if (loading) return <SplashScreen notMain>Loading Products...</SplashScreen>;

  if (isError)
    return (
      <DisplayError
        error={error}
        initMsg={"something went wrong while displaying products"}
      />
    );

  return !products.length ? (
    <>
      {isDashboard ? (
        <>
          <strong>
            no products to show, add some products to display it here
          </strong>
          <GoToMakeNewBtn />
        </>
      ) : (
        <h1>We Will Add some products later.</h1>
      )}
    </>
  ) : (
    <section className="section">
      <Heading content="Products List" />
      {isDashboard && user?.isAdmin && <GoToMakeNewBtn />}

      <GridList cells={listCell} initType="column">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            withAddToCart={!isDashboard}
          />
        ))}
      </GridList>

      {isFetching && <strong>updating the list...</strong>}
    </section>
  );
};

export default ProductsPage;
