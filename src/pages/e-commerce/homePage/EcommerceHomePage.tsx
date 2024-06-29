// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

// sections
import HomePageImgsSlider from "./sections/HomePageImgsSlider";
import BrandsList from "./sections/BrandsList";
import HomePageCategoriesLists from "./sections/categoriesLists/HomePageCategoriesLists";
import BottomBanner from "./sections/BottomBanner";

const HomePage = () => {
  return (
    <AnimatedLayout>
      <HomePageImgsSlider />
      <BrandsList />
      <HomePageCategoriesLists />
      <BottomBanner />
    </AnimatedLayout>
  );
};
export default HomePage;
