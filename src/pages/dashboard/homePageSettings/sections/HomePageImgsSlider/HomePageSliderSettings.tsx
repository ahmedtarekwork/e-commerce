// react
import { useEffect, useState } from "react";

// components
import AddImgsToHomeSlidedrBtn from "./AddImgsToHomeSliderBtn";
import RemoveImgFromSlider from "./RemoveImgFromSlider";
import BtnWithSpinner from "../../../../../components/animatedBtns/BtnWithSpinner";
import Spinner from "../../../../../components/spinners/Spinner";
import GridList from "../../../../../components/gridList/GridList";

// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useDispatch from "../../../../../hooks/redux/useDispatch";
import useSelector from "../../../../../hooks/redux/useSelector";
// redux actions
import {
  setHomeSliderImgsAction,
  addImgsToHomeSliderAction,
} from "../../../../../store/fetures/homePageSliderImgsSlice";

// hooks
import useGetHomePageSliderImgs from "../../../../../hooks/ReactQuery/useGetHomePageSliderImgs";
import useHandleErrorMsg from "../../../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../../../hooks/useShowMsg";

// utils
import axios from "../../../../../utils/axios";
import { nanoid } from "@reduxjs/toolkit";

// framer motion
import { motion } from "framer-motion";

// fetchers
const addImageToHomeSliderMutationFn = async (imgs: File[]) => {
  const formData = new FormData();

  imgs.forEach((img) => formData.append("images[]", img));

  return (
    await axios.post("dashboard/homepageSliderImgs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};

const HomePageSliderSettings = () => {
  const dispatch = useDispatch();
  const { imgs } = useSelector((state) => state.homePageSliderImgs);
  const showMsg = useShowMsg();

  const [imgsToUpload, setImgsToUpload] = useState<File[]>([]);

  // hooks
  const handleError = useHandleErrorMsg();

  const {
    data: homePageSliderImgs,
    isError: homePageSliderImgsErr,
    isPending: homePageSliderImgsLoading,
    fetchStatus,
    refetch: getHomePageSliderImgs,
    error: homePageSliderImgsErrData,
  } = useGetHomePageSliderImgs();

  const {
    isPending: newHomePageSliderImgsLoading,
    mutate: addImgsToHomeSlider,
    isSuccess: isImgsRemoved,
  } = useMutation({
    mutationKey: ["addImageToHomeSlider"],
    mutationFn: addImageToHomeSliderMutationFn,
    onError(error) {
      handleError(error, {
        forAllStates:
          "sorry, can't put images in the home page slider at the moment",
      });
    },
    onSuccess(data) {
      showMsg?.({
        clr: "green",
        content: "message" in data ? data.message : "images successfully added",
      });

      setTimeout(() => {
        dispatch(addImgsToHomeSliderAction(data.images));
        setImgsToUpload([]);
      }, 1200);
    },
  });

  useEffect(() => {
    if (!imgs.length) getHomePageSliderImgs();
  }, []);

  useEffect(() => {
    if (homePageSliderImgs) {
      dispatch(setHomeSliderImgsAction(homePageSliderImgs));
    }
  }, [homePageSliderImgs, dispatch]);

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
    const errorMessage =
      "message" in homePageSliderImgsErrData
        ? homePageSliderImgsErrData.message
        : "something went wrogn while fetching images!";

    return (
      <p
        style={{
          color: "var(--danger)",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {errorMessage}
      </p>
    );
  }

  if (!homePageSliderImgsErr && !imgs?.length && !imgsToUpload.length) {
    // no images in home page slider and no image has been selected to upload
    return (
      <p style={{ color: "var(--danger)" }}>
        <strong
          style={{ marginBottom: 10, display: "block", textAlign: "center" }}
        >
          There aren't any home page slider images.
        </strong>{" "}
        <AddImgsToHomeSlidedrBtn setImgsToUpload={setImgsToUpload}>
          Add some images
        </AddImgsToHomeSlidedrBtn>
      </p>
    );
  }

  // there is an images arrived from server
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

      {imgsToUpload.length ? (
        <div
          style={{
            border: "var(--brdr)",
            padding: 10,
            borderRadius: "var(--radius)",
          }}
        >
          <strong
            style={{
              marginBottom: 10,
              display: "block",
            }}
          >
            Images Will Be Added To The Home Page Slider
          </strong>

          <GridList
            initType="column"
            isChanging={false}
            cells={[]}
            className="home-page-slider-settings-imgs-list-preview"
          >
            {imgsToUpload.map((img, i) => (
              <li key={nanoid()}>
                <img
                  width="100%"
                  height="100%"
                  style={{ opacity: 0.8 }}
                  src={URL.createObjectURL(img)}
                  alt="home page slider image that's will be uploaded"
                />

                <button
                  title="remove image from list"
                  disabled={isImgsRemoved || newHomePageSliderImgsLoading}
                  className="red-btn"
                  onClick={() => {
                    setImgsToUpload((prev) =>
                      prev.filter((_, ind) => i !== ind)
                    );
                  }}
                >
                  cancel
                </button>
              </li>
            ))}
          </GridList>

          <div className="home-page-slider-settings-down-btns">
            <BtnWithSpinner
              toggleSpinner={newHomePageSliderImgsLoading}
              title="upload selected images to home page iamges slider"
              onClick={async () => addImgsToHomeSlider(imgsToUpload)}
              className="btn"
              disabled={newHomePageSliderImgsLoading || isImgsRemoved}
            >
              submit images
            </BtnWithSpinner>

            <AddImgsToHomeSlidedrBtn
              data-disabled={newHomePageSliderImgsLoading || isImgsRemoved}
              setImgsToUpload={setImgsToUpload}
            >
              Add more
            </AddImgsToHomeSlidedrBtn>
          </div>
        </div>
      ) : (
        <>
          <AddImgsToHomeSlidedrBtn
            setImgsToUpload={setImgsToUpload}
            style={{
              width: "fit-content",
              marginInline: "auto",
            }}
          >
            Add more images
          </AddImgsToHomeSlidedrBtn>
        </>
      )}
    </>
  );
};
export default HomePageSliderSettings;
