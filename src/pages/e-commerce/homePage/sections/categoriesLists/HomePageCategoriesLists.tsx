// components
import Spinner from "../../../../../components/spinners/Spinner";
import Heading from "../../../../../components/Heading";
import HomePageProductsSlider, {
  type ProductsSliderFilters,
} from "./components/HomePageProductsSlider";

// utils
import { nanoid } from "@reduxjs/toolkit";

// hooks
import useGetCategories from "../../../../../hooks/ReactQuery/products/useGetCategories";
import { memo } from "react";

const HomePageCategoriesLists = memo(() => {
  const { data: categories, isPending: categoriesLoading } =
    useGetCategories(7);

  if (categoriesLoading)
    return (
      <Spinner
        content="Loading Categories..."
        style={{
          marginBlock: "20px",
          margin: "90px auto",
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
});
export default HomePageCategoriesLists;
