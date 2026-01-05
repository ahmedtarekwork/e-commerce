// react
import type { Dispatch, SetStateAction } from "react";

// components
import BtnWithSpinner from "../../../../../components/animatedBtns/BtnWithSpinner";
import GridList from "../../../../../components/gridList/GridList";
import AddImgsToHomeSlidedrBtn from "./AddImgsToHomeSliderBtn";

// react query
import { useMutation } from "@tanstack/react-query";

// redux
import useDispatch from "../../../../../hooks/redux/useDispatch";

// hooks
import useHandleErrorMsg from "../../../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../../../hooks/useShowMsg";

// utils
import axios from "../../../../../utils/axios";

// redux actions
import { addImgsToHomeSliderAction } from "../../../../../store/fetures/homePageSliderImgsSlice";

type Props = {
  imgsToUpload: { id: string; file: File }[];
  setImgsToUpload: Dispatch<SetStateAction<{ id: string; file: File }[]>>;
};

// fetchers
const addImageToHomeSliderMutationFn = async (
  imgs: { id: string; file: File }[]
) => {
  const formData = new FormData();

  imgs.forEach((img) => formData.append("images[]", img.file));

  return (
    await axios.post("dashboard/homepageSliderImgs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};

const SelectedImgsToUpload = ({ imgsToUpload, setImgsToUpload }: Props) => {
  const dispatch = useDispatch();
  const showMsg = useShowMsg();
  const handleError = useHandleErrorMsg();

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

  if (!imgsToUpload.length) {
    return (
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
    );
  }

  return (
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
        {imgsToUpload.map((item, i) => (
          <li key={item.id}>
            <img
              width="100%"
              height="100%"
              style={{ opacity: 0.8 }}
              src={URL.createObjectURL(item.file)}
              alt={`home page slider image No.${i + 1} that's will be uploaded`}
            />

            <button
              title="remove image from list"
              disabled={isImgsRemoved || newHomePageSliderImgsLoading}
              className="red-btn"
              onClick={() => {
                setImgsToUpload((prev) =>
                  prev.filter((img) => img.id !== item.id)
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
  );
};
export default SelectedImgsToUpload;
