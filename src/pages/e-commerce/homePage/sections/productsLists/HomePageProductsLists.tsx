// react
import { memo } from "react";

// components
import HomePageProductsListsTile from "./components/HomePageProductsListsTile";
import Spinner from "../../../../../components/spinners/Spinner";
import HomePageProductsSlider, {
  type CategoryAndBestSell,
} from "../productsLists/components/HomePageProductsSlider";

// utils
import { nanoid } from "@reduxjs/toolkit";

// hooks
import useGetBrandsOrCategories from "../../../../../hooks/ReactQuery/useGetBrandsOrCategories";

const bestSellId = nanoid();

const HomePageProductsLists = memo(() => {
  const { data: categories, isPending: categoriesLoading } =
    useGetBrandsOrCategories("categories", 7);

  if (categoriesLoading) {
    return (
      <Spinner
        content="Loading Categories..."
        style={{
          marginBlock: "20px",
          margin: "90px auto",
        }}
      />
    );
  }

  if (categories) {
    const sections: (CategoryAndBestSell & { _id: string })[] = [
      { bestSell: true, _id: bestSellId },
      ...categories.map(({ name, _id }) => ({ category: name, _id })),
    ];

    return (
      <>
        <HomePageProductsListsTile />

        {sections.map(({ _id, ...slider }) => (
          <HomePageProductsSlider
            key={_id}
            filters={{ ...slider, limit: 10 }}
          />
        ))}
      </>
    );
  }
});
export default HomePageProductsLists;
