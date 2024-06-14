// react
import { useEffect } from "react";

// redux
import useDispatch from "../../../../hooks/redux/useDispatch";
import useSelector from "../../../../hooks/redux/useSelector";
// redux acions
import { setHomeSliderImgsAction } from "../../../../store/fetures/homePageSliderImgsSlice";

// components
import Spinner from "../../../../components/spinners/Spinner";
import ImgsSlider from "../../../../components/ImgsSlider";

// hooks
import useGetHomePageSliderImgs from "../../../../hooks/ReactQuery/useGetHomePageSliderImgs";

// SVGs
import welcomePlaceholder from "../../../../../imgs/welcomePlaceholder.svg";

const HomePageImgsSlider = () => {
  const dispatch = useDispatch();
  const { imgs } = useSelector((state) => state.homePageSliderImgs);

  const {
    data: homePageSliderImgs,
    isError: homePageSliderImgsErr,
    isPending: homePageSliderImgsLoading,
    refetch: getHomePageSliderImgs,
    fetchStatus,
  } = useGetHomePageSliderImgs(true);

  useEffect(() => {
    getHomePageSliderImgs();
  }, []);

  useEffect(() => {
    if (homePageSliderImgs) {
      dispatch(setHomeSliderImgsAction(homePageSliderImgs));
    }
  }, [homePageSliderImgs, dispatch]);

  if (homePageSliderImgsErr || !imgs.length) {
    return (
      <div className="no-home-slider-imgs home-slider">
        <img
          width="100%"
          height="100%"
          src={welcomePlaceholder}
          alt="welcome placeholder"
        />
        <div>
          <p>Welcome to E-commerce Store</p>
          {homePageSliderImgsLoading && fetchStatus !== "idle" && (
            <Spinner settings={{ clr: "var(--dark)" }} />
          )}
        </div>
      </div>
    );
  }

  if (!homePageSliderImgsErr && imgs.length) {
    return (
      <ImgsSlider
        isHomeSlider
        imgWidth="100%"
        imgs={imgs.map((img) => img.image)}
        withTimer={{
          value: true,
          time: 5000,
        }}
      />
    );
  }
};
export default HomePageImgsSlider;
