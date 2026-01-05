// react
import { memo, useCallback, useState } from "react";

// components
import EmptySpinner from "../../../../../components/spinners/EmptySpinner";
import HomePageProductsSlider, {
  type CategoryAndBestSell,
} from "../productsLists/components/HomePageProductsSlider";
import HomePageProductsListsTile from "./components/HomePageProductsListsTile";

// utils
import { nanoid } from "@reduxjs/toolkit";

// hooks
import useGetBrandsOrCategories from "../../../../../hooks/ReactQuery/useGetBrandsOrCategories";

const bestSellId = nanoid();

const CATEGORIES_LENGTH = 7;
const FINAL_RENDERED_CATEGORIES_LENGTH = CATEGORIES_LENGTH + 1;

const HomePageProductsLists = memo(() => {
  const [showTitle, setShowTitle] = useState(true);
  const [slidersNotLoadingLength, setSlidersNotLoadingLength] = useState(0);

  const changeSlidersNotLoadingLength = useCallback(() => {
    setSlidersNotLoadingLength((prev) => prev + 1);
  }, []);

  const { data: categories, isPending: categoriesLoading } =
    useGetBrandsOrCategories("categories", CATEGORIES_LENGTH);

  if (categoriesLoading) {
    return (
      <strong className="home-page-products-slider-loading">
        Loading {/*eslint-disable-next-line no-extra-boolean-cast*/}
        {!!slidersNotLoadingLength ? "More" : "Available"} Products...
        <EmptySpinner
          settings={{
            diminsions: "28px",
            "brdr-width": "3px",
          }}
        />
      </strong>
    );
  }

  if (categories) {
    const sections: (CategoryAndBestSell & { _id: string })[] = [
      { bestSell: true, _id: bestSellId },
      ...categories.map(({ name, _id }) => ({ category: name, _id })),
    ];

    return (
      <>
        {showTitle && <HomePageProductsListsTile />}

        {sections.map(({ _id, ...slider }) => (
          <HomePageProductsSlider
            key={_id}
            filters={{ ...slider, limit: 10 }}
            setShowTitle={setShowTitle}
            setSlidersNotLoadingLength={changeSlidersNotLoadingLength}
          />
        ))}

        {slidersNotLoadingLength < FINAL_RENDERED_CATEGORIES_LENGTH && (
          <strong className="home-page-products-slider-loading">
            Loading
            {/*eslint-disable-next-line no-extra-boolean-cast*/}
            {!!slidersNotLoadingLength ? "More" : "Available"} Products...
            <EmptySpinner
              settings={{
                diminsions: "28px",
                "brdr-width": "3px",
              }}
            />
          </strong>
        )}
      </>
    );
  }
});
export default HomePageProductsLists;
