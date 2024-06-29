// react
import { useEffect, useState, useRef } from "react";

// components
import AddImgsToHomeSlidedrBtn from "./AddImgsToHomeSliderBtn";
import RemoveImgFromSlider from "./RemoveImgFromSlider";
import BtnWithSpinner from "../../../../../components/animatedBtns/BtnWithSpinner";
import Spinner from "../../../../../components/spinners/Spinner";
import GridList from "../../../../../components/gridList/GridList";
import TopMessage, {
  type TopMessageRefType,
} from "../../../../../components/TopMessage";

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

// utils
import axios from "../../../../../utiles/axios";
import { nanoid } from "@reduxjs/toolkit";
import handleError from "../../../../../utiles/functions/handleError";
import convertFilesToBase64 from "../../../../../utiles/functions/files/convertFilesToBase64";

// framer motion
import { motion } from "framer-motion";

// fetchers
const addImageToHomeSliderMutationFn = async (imgs: { image: string }[]) => {
  return (
    await axios.post("dashboard/homepageSliderImgs", {
      images: imgs,
    })
  ).data.imgs;
};

const HomePageSliderSettings = () => {
  const dispatch = useDispatch();
  const { imgs } = useSelector((state) => state.homePageSliderImgs);
  const [imgsToUpload, setImgsToUpload] = useState<File[]>([]);

  // refs
  const msgRef = useRef<TopMessageRefType>(null);

  const {
    data: homePageSliderImgs,
    isError: homePageSliderImgsErr,
    isPending: homePageSliderImgsLoading,
    fetchStatus,
    refetch: getHomePageSliderImgs,
  } = useGetHomePageSliderImgs();

  const {
    data: newHomePageSliderImgs,
    error: newHomePageSliderImgsErrData,
    isPending: newHomePageSliderImgsLoading,
    mutate: addImgsToHomeSlider,
    isSuccess: isImgsRemoved,
  } = useMutation({
    mutationKey: ["addImageToHomeSlider"],
    mutationFn: addImageToHomeSliderMutationFn,
  });

  useEffect(() => {
    if (!imgs.length) getHomePageSliderImgs();
  }, []);

  useEffect(() => {
    if (homePageSliderImgs) {
      dispatch(setHomeSliderImgsAction(homePageSliderImgs));
    }
  }, [homePageSliderImgs, dispatch]);

  useEffect(() => {
    if (newHomePageSliderImgs) {
      msgRef.current?.setMessageData({
        clr: "green",
        content: "images successfully added",
        show: true,
        time: 1200,
      });

      setTimeout(() => {
        dispatch(addImgsToHomeSliderAction(newHomePageSliderImgs));
        setImgsToUpload([]);
      }, 1200);
    }

    if (newHomePageSliderImgsErrData) {
      handleError(newHomePageSliderImgsErrData, msgRef, {
        forAllStates:
          "sorry, can't put images in the home page slider at the moment",
      });
    }
  }, [newHomePageSliderImgsErrData, newHomePageSliderImgs, dispatch]);

  // loading
  if (homePageSliderImgsLoading && fetchStatus !== "idle") {
    return <Spinner fullWidth={true}>Loading Images...</Spinner>;
  }

  // no images in home page slider and no image has been selected to upload
  if (homePageSliderImgsErr && !imgs?.length && !imgsToUpload.length) {
    return (
      <p style={{ color: "var(--danger)" }}>
        <strong>There aren't any home page slider images.</strong>{" "}
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
        {imgs.map(({ image, _id }) => (
          <motion.li layout key={_id}>
            <img
              width="100%"
              height="100%"
              src={image}
              alt="home page slider image"
            />

            <RemoveImgFromSlider imgId={_id} msgRef={msgRef} />
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
              onClick={async () => {
                const finalImgs: { image: string }[] = [];

                for (let i = 0; i < imgsToUpload.length; i++) {
                  const base64Img = await convertFilesToBase64(imgsToUpload[i]);
                  finalImgs.push({ image: base64Img });
                }
                addImgsToHomeSlider(finalImgs);
              }}
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

      <TopMessage ref={msgRef} />
    </>
  );
};
export default HomePageSliderSettings;
