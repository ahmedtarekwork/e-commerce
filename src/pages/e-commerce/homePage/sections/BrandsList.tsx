// react router dom
import { Link } from "react-router-dom";

// components
import Heading from "../../../../components/Heading";
import EmptySpinner from "../../../../components/spinners/EmptySpinner";

// hooks
import useGetBrands from "../../../../hooks/ReactQuery/products/useGetBrands";

// utils
import { nanoid } from "@reduxjs/toolkit";
// swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
// swiper.css
import "swiper/css";
import "swiper/css/navigation";

// icons
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const BrandsList = () => {
  const { data, isPending } = useGetBrands(15);

  if (isPending)
    return (
      <div className="home-page-brands-list-loading-holder">
        <strong>Loading Available Brands</strong>

        <EmptySpinner
          settings={{
            diminsions: "25px",
            "brdr-width": "3px",
            clr: "var(--dark)",
          }}
        />
      </div>
    );

  if (data)
    return (
      <>
        <Heading>Available Brands</Heading>

        <div className="brands-list-wrapper">
          <button
            className="swiper-button-custom-prev"
            title="slide to previous brand"
          >
            <BiChevronLeft />
          </button>

          <Swiper
            className="home-page-brands-list"
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
            {data.map((b) => (
              <SwiperSlide key={nanoid()}>
                <Link to={`/products?brand=${b}`} relative="path">
                  {b}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="swiper-button-custom-next"
            title="slide to next brand"
          >
            <BiChevronRight />
          </button>
        </div>
      </>
    );
};
export default BrandsList;
