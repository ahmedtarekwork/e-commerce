// utils
import { nanoid } from "@reduxjs/toolkit";

// swiper.js
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
// swiper.css
import "swiper/css";
import "swiper/css/pagination";
// swiper types
import type { SwiperOptions } from "swiper/types";

type Props = {
  imgs: string[];
  imgWidth: string;
  withTimer?: {
    value: boolean;
    time: number;
  };
  isHomeSlider?: boolean;
};

const ImgsSlider = ({ imgs, imgWidth, withTimer, isHomeSlider }: Props) => {
  const swiperConfig: SwiperOptions = {};

  if (imgs.length > 1) {
    swiperConfig.modules = [...(swiperConfig.modules || []), Pagination];
    swiperConfig.pagination = {
      dynamicBullets: true,
      clickable: true,
    };
  }

  if (withTimer?.value) {
    swiperConfig.modules = [...(swiperConfig.modules || []), Autoplay];
    swiperConfig.autoplay = {
      delay: withTimer?.time,
    };
  }

  return (
    <Swiper
      className={isHomeSlider ? "home-slider" : ""}
      loop={isHomeSlider}
      slidesPerView="auto"
      {...swiperConfig}
    >
      {imgs.map((img) => (
        <SwiperSlide
          key={nanoid()}
          style={{
            display: "grid",
            placeContent: "center",
          }}
        >
          <img
            style={{
              objectFit: "contain",
              width: imgWidth,
            }}
            width={imgWidth}
            height={imgWidth}
            src={img}
            alt="prodcut image"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default ImgsSlider;
