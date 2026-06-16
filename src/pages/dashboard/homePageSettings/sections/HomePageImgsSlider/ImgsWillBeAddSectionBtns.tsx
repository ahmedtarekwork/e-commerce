// react
import type { Dispatch, SetStateAction } from "react";

// components
import SubmitImgsToHomeSliderBtn from "./SubmitImgsToHomeSliderBtn";
import AddImgsToHomeSlidedrBtn from "./AddImgsToHomeSliderBtn";

// types
import type { SelectedImgsToUploadProps } from "./SelectedImgsToUpload";

type Props = SelectedImgsToUploadProps & {
  submitImgsLoading: boolean;
  setSubmitImgsLoading: Dispatch<SetStateAction<boolean>>;
};

const ImgsWillBeAddSectionBtns = ({
  setSubmitImgsLoading,
  submitImgsLoading,
  setImgsToUpload,
  imgsToUpload,
}: Props) => {
  return (
    <div className="home-page-slider-settings-down-btns">
      <SubmitImgsToHomeSliderBtn
        setSubmitImgsLoading={setSubmitImgsLoading}
        setImgsToUpload={setImgsToUpload}
        imgsToUpload={imgsToUpload}
      />

      <AddImgsToHomeSlidedrBtn
        data-disabled={submitImgsLoading}
        setImgsToUpload={setImgsToUpload}
      >
        Add more
      </AddImgsToHomeSlidedrBtn>
    </div>
  );
};
export default ImgsWillBeAddSectionBtns;
