// react
import { useEffect } from "react";

// redux
import useDispatch from "../../../../hooks/redux/useDispatch";
import useSelector from "../../../../hooks/redux/useSelector";
// redux acions
import { setHomeSliderImgsAction } from "../../../../store/fetures/homePageSliderImgsSlice";

// components
import ImgsSlider from "../../../../components/ImgsSlider";
import EmptySpinner from "../../../../components/spinners/EmptySpinner";

// hooks
import useGetHomePageSliderImgs from "../../../../hooks/ReactQuery/useGetHomePageSliderImgs";

// SVGs
import welcomePlaceholder from "../../../../../imgs/welcomePlaceholder.svg";

// framer motion
import { AnimatePresence } from "framer-motion";
// layouts
import AnimatedLayout from "../../../../layouts/AnimatedLayout";

const HomePageImgsSlider = () => {
  const dispatch = useDispatch();
  const { imgs } = useSelector((state) => state.homePageSliderImgs);

  const {
    data: homePageSliderImgs,
    isError: homePageSliderImgsErr,
    isPending: homePageSliderImgsLoading,
    fetchStatus,
  } = useGetHomePageSliderImgs();

  useEffect(() => {
    if (homePageSliderImgs) {
      dispatch(setHomeSliderImgsAction(homePageSliderImgs));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homePageSliderImgs]);

  return (
    <AnimatePresence mode="wait">
      {(homePageSliderImgsErr || !imgs.length) && (
        <AnimatedLayout
          key="one"
          className="no-home-slider-imgs home-slider"
          withFlex={false}
        >
          <img
            width="100%"
            height="100%"
            src={welcomePlaceholder}
            alt="welcome placeholder"
          />
          <div className="no-home-slider-imgs-contnet-holder">
            <p>Welcome to E-commerce Store</p>
            {homePageSliderImgsLoading && fetchStatus !== "idle" && (
              <EmptySpinner
                settings={{
                  diminsions: "50px",
                  "brdr-width": "3.5px",
                }}
              />
            )}
          </div>
        </AnimatedLayout>
      )}

      {!homePageSliderImgsErr && imgs.length && (
        <AnimatedLayout key="two">
          <ImgsSlider
            isHomeSlider
            imgWidth="100%"
            imgs={imgs}
            withTimer={{
              value: true,
              time: 5000,
            }}
          />
        </AnimatedLayout>
      )}
    </AnimatePresence>
  );
};
export default HomePageImgsSlider;
