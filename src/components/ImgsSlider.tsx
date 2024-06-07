import { CSSProperties, createRef, useEffect, useRef } from "react";
import { nanoid } from "@reduxjs/toolkit";

type Props = {
  imgs: string[];
  imgWidth: string;
  withTimer?: {
    value: boolean;
    time: number;
  };
};

const ImgsSlider = ({ imgs, imgWidth, withTimer }: Props) => {
  const imgsHoldersRefs = imgs.map(() => createRef<HTMLDivElement>());
  const SliderBtnsRefs = imgs.map(() => createRef<HTMLButtonElement>());

  const activeIndex = useRef<number>(0);

  let interval: number = 0;

  const setActiveImg = (activeIndex: number) => {
    SliderBtnsRefs.forEach((btn, index) =>
      btn.current?.classList.toggle("active", index === activeIndex)
    );

    imgsHoldersRefs.forEach((holder) => {
      if (holder.current)
        holder.current.style.translate = `calc(${activeIndex * -100}% - ${
          activeIndex * 10
        }px)`;
    });
  };

  const slideImgs = () => {
    clearInterval(interval);

    interval = setInterval(() => {
      const maxLength = imgsHoldersRefs.length;

      const nextIndex =
        activeIndex.current + 1 === maxLength ? 0 : activeIndex.current + 1;
      activeIndex.current = nextIndex;

      setActiveImg(nextIndex);
    }, withTimer?.time) as unknown as number;
  };

  // play the interval for sliding imgs if "withTimer.value = true" in intial render || when the props.withTimer is changing to "true"
  // --> "don't change dependinces array!"
  useEffect(() => {
    if (withTimer?.value) {
      slideImgs();
      return () => clearInterval(interval);
    }
  }, [withTimer]);

  return (
    <div className="slider-big-holder">
      <div
        className="slider-real-list"
        style={
          {
            "--img-width": imgWidth,
            width: imgs.length * 100 + "%",
          } as CSSProperties
        }
      >
        {imgs.map((img, i) => (
          <div
            key={nanoid()}
            className="slider-img-holder"
            ref={imgsHoldersRefs[i]}
          >
            <img width="100%" height="100%" src={img} alt="prodcut image" />
          </div>
        ))}
      </div>

      {imgs.length > 1 && (
        <div className="slider-dots-holder">
          {imgs.map((_, i) => (
            <button
              ref={SliderBtnsRefs[i]}
              onClick={() => {
                setActiveImg(i);
                if (withTimer) slideImgs();
              }}
              key={nanoid()}
              className={`slider-dot ${i === 0 ? "active" : ""}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};
export default ImgsSlider;
