// react
import { useState, type Dispatch, type SetStateAction } from "react";

// components
import GridList from "../../../../../components/gridList/GridList";
import AddImgsToHomeSlidedrBtn from "./AddImgsToHomeSliderBtn";
import ImgsWillBeAddSectionBtns from "./ImgsWillBeAddSectionBtns";

export type SelectedImgsToUploadProps = {
  imgsToUpload: { id: string; file: File }[];
  setImgsToUpload: Dispatch<SetStateAction<{ id: string; file: File }[]>>;
};

const SelectedImgsToUpload = ({
  imgsToUpload,
  setImgsToUpload,
}: SelectedImgsToUploadProps) => {
  const [submitImgsLoading, setSubmitImgsLoading] = useState(false);

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
              disabled={submitImgsLoading}
              className="red-btn"
              onClick={() => {
                setImgsToUpload((prev) =>
                  prev.filter((img) => img.id !== item.id),
                );
              }}
            >
              cancel
            </button>
          </li>
        ))}
      </GridList>

      <ImgsWillBeAddSectionBtns
        setImgsToUpload={setImgsToUpload}
        imgsToUpload={imgsToUpload}
        submitImgsLoading={submitImgsLoading}
        setSubmitImgsLoading={setSubmitImgsLoading}
      />
    </div>
  );
};
export default SelectedImgsToUpload;
