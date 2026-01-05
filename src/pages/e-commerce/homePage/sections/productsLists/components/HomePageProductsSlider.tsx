// react
import { type Dispatch, memo, type SetStateAction, useEffect } from "react";

// react router dom
import { Link } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// component
import ProductCard from "../../../../../../components/productCard/ProductCard";

// utils
import axios from "axios";

// swiper.js
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// swiper css
import "swiper/css";
import "swiper/css/navigation";

// types
import type { ProductType } from "../../../../../../utils/types";

// types
export type CategoryAndBestSell =
  | {
      bestSell: true;
      category: string;
    }
  | {
      bestSell: true;
      category?: never;
    }
  | {
      bestSell?: never;
      category: string;
    };

export type ProductsSliderFilters = CategoryAndBestSell &
  Partial<{
    limit: number;
    page: number;
  }>;

type Props = {
  filters: ProductsSliderFilters;
  setShowTitle: Dispatch<SetStateAction<boolean>>;
  setSlidersNotLoadingLength: () => void;
};

type GetLimitedProductsFnType = (params: {
  queryKey: [string, ProductsSliderFilters];
}) => Promise<ProductType[]>;

// fetchers
const getLimitedProductsFromSpecificCategory: GetLimitedProductsFnType =
  async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queryKey: [_, filters],
  }) => {
    const queries = Object.entries(filters)
      .map(([filter, value]) => `${filter}=${value}`)
      .join("&");

    return (await axios.get(`products?${queries}`)).data.products;
  };

const HomePageProductsSlider = memo(
  ({ filters, setShowTitle, setSlidersNotLoadingLength }: Props) => {
    const { bestSell, category } = filters;

    const {
      data,
      isPending: isLoading,
      fetchStatus,
    } = useQuery({
      queryKey: ["getLimitedProductsFromSpecificCategory", filters],
      queryFn: getLimitedProductsFromSpecificCategory,
    });

    let textSideContent: string = "";

    useEffect(() => {
      if (data && !isLoading) setShowTitle(true);
      if (!isLoading) setSlidersNotLoadingLength();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isLoading]);

    if (bestSell && !category) textSideContent = "Best Sell";
    if (!bestSell && category) textSideContent = category;
    if (bestSell && category) textSideContent = category + "Best Sales";

    if (!data?.length && !isLoading && fetchStatus !== "fetching") return null;

    return (
      <div className="home-page-products-slider">
        {data && !isLoading && (
          <>
            <p className="home-page-products-slider-text-side">
              {textSideContent}
            </p>

            <Swiper
              slidesPerView={2.5}
              spaceBetween={10}
              className="products-list-with-border"
              navigation={true}
              modules={[Navigation, FreeMode]}
              grabCursor={true}
              freeMode={true}
              breakpoints={{
                1199: {
                  slidesPerView: 4.5,
                },
                991: {
                  slidesPerView: 3.5,
                },
                601: {
                  slidesPerView: 2.1,
                },
                450: {
                  slidesPerView: 1.5,
                },
                1: {
                  slidesPerView: 1,
                },
              }}
            >
              {data.map((product) => (
                <SwiperSlide key={product._id}>
                  <ProductCard
                    product={{ ...product, imgs: [product.imgs[0]] }}
                    className="card-mode"
                    TagName="div"
                    imgWidth="130px"
                    withQty={false}
                    withAddToWishList
                    withAddToCart
                  />
                </SwiperSlide>
              ))}

              {!bestSell && category && (
                <SwiperSlide className="home-page-products-slider-explore-more-card">
                  <Link
                    title="go to products page with specific category btn"
                    to={`/products?category=${category}`}
                    relative="path"
                  >
                    <span className="plus-icon">+</span> More
                  </Link>
                </SwiperSlide>
              )}
            </Swiper>
          </>
        )}
      </div>
    );
  }
);

export default HomePageProductsSlider;
