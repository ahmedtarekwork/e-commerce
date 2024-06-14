// react
import { type RefObject, useEffect } from "react";

// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useDispatch from "../../../../../hooks/redux/useDispatch";
// redux actions
import { removeImgsFromHomeSliderAction } from "../../../../../store/fetures/homePageSliderImgsSlice";

// utils
import handleError from "../../../../../utiles/functions/handleError";
import { axiosWithToken } from "../../../../../utiles/axios";

// types
import { type TopMessageRefType } from "../../../../../components/TopMessage";

type Props = {
  imgId: string;
  msgRef: RefObject<TopMessageRefType>;
};

const removeImgFromHomeSliderMutationFn = async (imgId: string) => {
  return (
    await axiosWithToken.delete("dashboard/homepageSliderImgs", {
      data: {
        imgId,
      },
    })
  ).data.imgId;
};

const RemoveImgFromSlider = ({ msgRef, imgId }: Props) => {
  const dispatch = useDispatch();

  const {
    mutate: removeImgFromSlider,
    data: removedImgId,
    error,
    isPending: isLoading,
    isSuccess,
  } = useMutation({
    mutationKey: ["removeImgsFromHomePageSlider", imgId],
    mutationFn: removeImgFromHomeSliderMutationFn,
  });

  useEffect(() => {
    if (removedImgId) {
      msgRef.current?.setMessageData({
        clr: "green",
        content: "image successfully removed",
        show: true,
        time: 1200,
      });

      setTimeout(() => {
        dispatch(removeImgsFromHomeSliderAction([removedImgId]));
      }, 1200);
    }

    if (error) {
      handleError(error, msgRef, {
        forAllStates: "sorry, we can't remove the image from slider right now",
      });
    }
  }, [removedImgId, error, dispatch, msgRef]);

  return (
    <button
      title="remove image form home page slider btn"
      disabled={isLoading || isSuccess}
      className={`red-btn${
        isLoading ? " center fade scale spinner-pseudo-after active" : ""
      }`}
      onClick={() => removeImgFromSlider(imgId)}
    >
      remove
    </button>
  );
};
export default RemoveImgFromSlider;
