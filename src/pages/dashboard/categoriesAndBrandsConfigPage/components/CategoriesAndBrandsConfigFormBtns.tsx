// components
import BtnWithSpinner from "../../../../components/animatedBtns/BtnWithSpinner";

// types
import type { SubmitCategoriesAndBrandsFormProps } from "../../../../hooks/useSubmitCategoriesAndBrandsConfigForm";

export type DisableSubmitCategoriesAndBrandsFormBtnsProps = Record<
  "editModelLoading" | "modelLoading",
  boolean
>;

type Props = DisableSubmitCategoriesAndBrandsFormBtnsProps &
  Pick<
    SubmitCategoriesAndBrandsFormProps,
    | "imgInputRef"
    | "id"
    | "name"
    | "image"
    | "oldModel"
    | "setName"
    | "setImage"
    | "modelName"
  >;

const CategoriesAndBrandsConfigFormBtns = ({
  id,
  name,
  image,
  setName,
  setImage,
  imgInputRef,
  oldModel,
  modelLoading,
  editModelLoading,
  modelName,
}: Props) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      <button
        disabled={modelLoading || editModelLoading}
        style={{ flex: 1 }}
        className="red-btn"
        type="button"
        onClick={() => {
          setImage(null);
          imgInputRef.current!.value = "";

          setName(id ? oldModel?.name || "" : "");
        }}
      >
        Reset
      </button>

      <BtnWithSpinner
        style={{ flex: 1 }}
        toggleSpinner={modelLoading || editModelLoading}
        className="btn"
        disabled={
          !name.trim() ||
          (id && name.trim() === oldModel?.name.trim() && !image) || // in edit mode
          (!id && !image) || // in normal mode
          modelLoading ||
          editModelLoading
        }
      >
        {id ? "update" : "submit"} {modelName}
      </BtnWithSpinner>
    </div>
  );
};
export default CategoriesAndBrandsConfigFormBtns;
