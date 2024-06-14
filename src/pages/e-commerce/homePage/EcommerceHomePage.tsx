// sections
import BottomBanner from "./sections/BottomBanner";
import HomePageCategoriesLists from "./sections/categoriesLists/HomePageCategoriesLists";
import HomePageImgsSlider from "./sections/HomePageImgsSlider";

const HomePage = () => {
  return (
    <>
      <HomePageImgsSlider />
      <HomePageCategoriesLists />
      <BottomBanner />
    </>
  );
};
export default HomePage;
