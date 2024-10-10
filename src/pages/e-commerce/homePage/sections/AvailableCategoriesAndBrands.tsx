// react router dom
import { Link } from "react-router-dom";

// components
import Heading from "../../../../components/Heading";
import EmptySpinner from "../../../../components/spinners/EmptySpinner";

// hooks
import useGetBrandsOrCategories from "../../../../hooks/ReactQuery/useGetBrandsOrCategories";

// swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
// swiper.css
import "swiper/css";
import "swiper/css/navigation";

// icons
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

type Props = {
  type: "Brands" | "Categories";
};

const AvailableCategoriesAndBrands = ({ type }: Props) => {
  const singleModelName = type === "Categories" ? "category" : "brand";

  const { data, isPending } = useGetBrandsOrCategories(
    type.toLowerCase() as Parameters<typeof useGetBrandsOrCategories>[0],
    15
  );

  if (isPending) {
    return (
      <div className="home-page-brands-and-categories-list-loading-holder">
        <strong>Loading Available {type}</strong>

        <EmptySpinner
          settings={{
            diminsions: "25px",
            "brdr-width": "3px",
            clr: "var(--dark)",
          }}
        />
      </div>
    );
  }

  if (data?.length) {
    return (
      <>
        <Heading>Available {type}</Heading>

        <div className="brands-and-categories-list-wrapper">
          <button
            className="swiper-button-custom-prev"
            title={`slide to previous ${singleModelName}`}
          >
            <BiChevronLeft />
          </button>

          <Swiper
            className="home-page-brands-and-categories-list"
            modules={[FreeMode, Navigation]}
            freeMode={true}
            navigation={{
              prevEl: ".swiper-button-custom-prev",
              nextEl: ".swiper-button-custom-next",
            }}
            slidesPerView={4}
            spaceBetween="10px"
            breakpoints={{
              768: {
                slidesPerView: 3.5,
              },
              450: {
                slidesPerView: 2.5,
              },
              1: {
                slidesPerView: 1.2,
              },
            }}
          >
            {data.map(({ _id, name, image: { secure_url } }) => (
              <SwiperSlide key={_id}>
                <Link
                  to={`/products?${singleModelName}=${name}`}
                  relative="path"
                  className="category-or-brand-card"
                >
                  <img
                    src={secure_url}
                    alt={`${name} ${type} image`}
                    width={150}
                    height={120}
                  />
                  <p>{name}</p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="swiper-button-custom-next"
            title={`slide to next ${singleModelName}`}
          >
            <BiChevronRight />
          </button>
        </div>
      </>
    );
  }

  return null;
};
export default AvailableCategoriesAndBrands;
