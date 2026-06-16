// react
import { useEffect, type Dispatch, type SetStateAction } from "react";

// components
import BtnWithSpinner from "../../../../../components/animatedBtns/BtnWithSpinner";

// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useDispatch from "../../../../../hooks/redux/useDispatch";
// redux actions
import { addImgsToHomeSliderAction } from "../../../../../store/fetures/homePageSliderImgsSlice";

// hooks
import useHandleErrorMsg from "../../../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../../../hooks/useShowMsg";

// utils
import axios from "../../../../../utils/axios";

// types
import type { SelectedImgsToUploadProps } from "./SelectedImgsToUpload";

type Props = {
  setSubmitImgsLoading: Dispatch<SetStateAction<boolean>>;
} & SelectedImgsToUploadProps;

// fetchers
const addImageToHomeSliderMutationFn = async (
  imgs: { id: string; file: File }[],
) => {
  const formData = new FormData();

  imgs.forEach((img) => formData.append("images[]", img.file));

  return (
    await axios.post("dashboard/homepageSliderImgs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};

const SubmitImgsToHomeSliderBtn = ({
  setSubmitImgsLoading,
  setImgsToUpload,
  imgsToUpload,
}: Props) => {
  const dispatch = useDispatch();
  const showMsg = useShowMsg();
  const handleError = useHandleErrorMsg();

  const {
    isPending: newHomePageSliderImgsLoading,
    mutate: addImgsToHomeSlider,
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

      dispatch(addImgsToHomeSliderAction(data.images));
      setImgsToUpload([]);
    },
  });

  useEffect(() => {
    setSubmitImgsLoading(newHomePageSliderImgsLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newHomePageSliderImgsLoading]);

  return (
    <BtnWithSpinner
      toggleSpinner={newHomePageSliderImgsLoading}
      title="upload selected images to home page iamges slider"
      onClick={() => addImgsToHomeSlider(imgsToUpload)}
      className="btn"
      disabled={newHomePageSliderImgsLoading}
    >
      submit images
    </BtnWithSpinner>
  );
};
export default SubmitImgsToHomeSliderBtn;
