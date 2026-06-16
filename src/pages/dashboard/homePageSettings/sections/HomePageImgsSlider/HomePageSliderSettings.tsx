// react
import { useEffect, useState } from "react";

// components
import GridList from "../../../../../components/gridList/GridList";
import Spinner from "../../../../../components/spinners/Spinner";
import AddImgsToHomeSlidedrBtn from "./AddImgsToHomeSliderBtn";
import RemoveImgFromSlider from "./RemoveImgFromSlider";
import SelectedImgsToUpload from "./SelectedImgsToUpload";

// redux
import useDispatch from "../../../../../hooks/redux/useDispatch";
import useSelector from "../../../../../hooks/redux/useSelector";
// redux actions
import { setHomeSliderImgsAction } from "../../../../../store/fetures/homePageSliderImgsSlice";

// hooks
import useGetHomePageSliderImgs from "../../../../../hooks/ReactQuery/useGetHomePageSliderImgs";

// framer motion
import { motion } from "framer-motion";

const HomePageSliderSettings = () => {
  const dispatch = useDispatch();
  const { imgs } = useSelector((state) => state.homePageSliderImgs);

  const [imgsToUpload, setImgsToUpload] = useState<
    { id: string; file: File }[]
  >([]);

  // hooks
  const {
    data: homePageSliderImgs,
    isError: homePageSliderImgsErr,
    isPending: homePageSliderImgsLoading,
    fetchStatus,
    error: homePageSliderImgsErrData,
  } = useGetHomePageSliderImgs();

  useEffect(() => {
    if (homePageSliderImgs) {
      dispatch(setHomeSliderImgsAction(homePageSliderImgs));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homePageSliderImgs]);

  // loading
  if (homePageSliderImgsLoading && fetchStatus !== "idle") {
    return <Spinner fullWidth={true}>Loading Images...</Spinner>;
  }

  // there is an error
  if (
    !homePageSliderImgsLoading &&
    fetchStatus !== "fetching" &&
    homePageSliderImgsErr
  ) {
    const defaultMsg = "something went wrogn while fetching images!";
    const errorMessage =
      "response" in homePageSliderImgsErrData &&
      (homePageSliderImgsErrData.response as { data: { message: string } })
        ?.data?.message;

    return (
      <p
        style={{
          color: "var(--danger)",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {errorMessage || defaultMsg}
      </p>
    );
  }

  // no images in home page slider and no image has been selected to upload
  if (!homePageSliderImgsErr && !imgs?.length && !imgsToUpload.length) {
    return (
      <>
        <strong
          style={{
            marginBottom: 10,
            display: "block",
            textAlign: "center",
            color: "var(--danger)",
          }}
        >
          There aren't any home page slider images.
        </strong>

        <AddImgsToHomeSlidedrBtn setImgsToUpload={setImgsToUpload}>
          Add some images
        </AddImgsToHomeSlidedrBtn>
      </>
    );
  }

  // there is an images arrived from server || images has been selected to upload || both
  return (
    <>
      <GridList
        initType="column"
        isChanging={false}
        cells={[]}
        className="home-page-slider-settings-imgs-list-preview"
      >
        {imgs.map(({ secure_url, public_id }) => (
          <motion.li layout key={public_id}>
            <img
              width="100%"
              height="100%"
              src={secure_url}
              alt="home page slider image"
            />

            <RemoveImgFromSlider imgId={public_id} />
          </motion.li>
        ))}
      </GridList>

      <SelectedImgsToUpload
        imgsToUpload={imgsToUpload}
        setImgsToUpload={setImgsToUpload}
      />
    </>
  );
};
export default HomePageSliderSettings;
