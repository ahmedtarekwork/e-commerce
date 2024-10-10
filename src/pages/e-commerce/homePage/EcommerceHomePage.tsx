// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

// sections
import HomePageImgsSlider from "./sections/HomePageImgsSlider";
import AvailableCategoriesAndBrands from "./sections/AvailableCategoriesAndBrands";
import HomePageProductsLists from "./sections/productsLists/HomePageProductsLists";
import BottomBanner from "./sections/BottomBanner";

const HomePage = () => {
  return (
    <AnimatedLayout>
      <HomePageImgsSlider />

      <AvailableCategoriesAndBrands type="Brands" />

      <AvailableCategoriesAndBrands type="Categories" />

      <HomePageProductsLists />

      <BottomBanner />
    </AnimatedLayout>
  );
};
export default HomePage;
