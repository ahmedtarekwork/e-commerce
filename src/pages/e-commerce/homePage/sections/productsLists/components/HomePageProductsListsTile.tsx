// components
import Heading from "../../../../../../components/Heading";

// redux
import useSelector from "../../../../../../hooks/redux/useSelector";

const HomePageProductsListsTile = () => {
  const { products } = useSelector((state) => state.products);

  return !!products.length && <Heading>Browse Our Collections</Heading>;
};
export default HomePageProductsListsTile;
