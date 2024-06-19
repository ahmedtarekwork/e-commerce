// components
import Spinner from "../../../../../components/spinners/Spinner";
import HomePageProductsSlider, {
  type ProductsSliderFilters,
} from "./components/HomePageProductsSlider";

// utils
import { nanoid } from "@reduxjs/toolkit";

// hooks
import useGetCategories from "../../../../../hooks/ReactQuery/products/useGetCategories";
import Heading from "../../../../../components/Heading";

const HomePageCategoriesLists = () => {
  const { data: categories, isPending: categoriesLoading } =
    useGetCategories(7);

  if (categoriesLoading)
    return (
      <Spinner
        content="Loading Categories..."
        style={{ fontSize: 14 }}
        settings={{
          clr: "var(--main)",
        }}
      />
    );

  if (categories) {
    const sections: ProductsSliderFilters[] = [{ bestSell: true }];
    categories.map((c) => sections.push({ category: c }));

    return (
      <>
        <Heading>Browse Our Collections</Heading>

        {sections.map((slider) => (
          <HomePageProductsSlider
            key={nanoid()}
            filters={{ ...slider, limit: 10 }}
          />
        ))}
      </>
    );
  }
};
export default HomePageCategoriesLists;
