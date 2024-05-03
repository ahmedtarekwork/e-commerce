// react
import { CSSProperties, useEffect } from "react";

// redux
import useDispatch from "../../hooks/useDispatch";
import { useSelector } from "react-redux";
// redux actions
import { setProducts } from "../../store/fetures/productsSlice";

// component
import Heading from "../../components/Heading";
import GridList from "../../components/gridList/GridList";
import ProductCard from "../../components/ProductCard";
import Spinner from "../../components/spinners/Spinner";
import DisplayError from "../../components/layout/DisplayError";
import ImgsSlider from "../../components/ImgsSlider";

// hooks
import useGetProducts from "../../hooks/useGetProducts";

// types
import { RootStateType } from "../../utiles/types";
import { ProductType } from "../../utiles/types";

// home slider imgs
import img1 from "../../imgs/home-slider/1.png";
import img2 from "../../imgs/home-slider/31591673541.jpg";

const HomePage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootStateType) => state.products);

  const {
    data: apiProducts,
    refetch: getProducts,
    isPending: productsLoading,
    isError: productsErr,
    error: productsErrData,
    isFetching: productsFetching,
  } = useGetProducts(true);

  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    if (apiProducts) dispatch(setProducts(apiProducts));
  }, [apiProducts, dispatch]);

  return (
    <>
      <div className="section">
        <Heading content="Welcome into Our Store" />
      </div>

      <ImgsSlider
        imgWidth="100%"
        imgs={[img1, img2]}
        withTimer={{
          value: true,
          time: 3000,
        }}
      />

      <h3>browse or products</h3>

      {productsLoading && (
        <Spinner settings={{ clr: "var(--main)" }}>Loading Products...</Spinner>
      )}
      {productsFetching && !productsLoading && (
        <strong
          className="spinner-pseudo-after active"
          style={{ "--clr": "var(--main)" } as CSSProperties}
        >
          Updating Products...
        </strong>
      )}
      {productsErr && <DisplayError error={productsErrData} />}

      <GridList initType="column" isChanging={false} cells={[]}>
        {products.map((prd: ProductType) => (
          <ProductCard
            key={prd._id}
            product={prd}
            withAddToCart
            withAddToWishList
          />
        ))}
      </GridList>
    </>
  );
};
export default HomePage;
