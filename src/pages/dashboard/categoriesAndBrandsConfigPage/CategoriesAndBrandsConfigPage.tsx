// react
import {
  useEffect,
  useRef,
  useState,

  // types
  type ChangeEvent,
} from "react";

// react router
import { Link, useSearchParams } from "react-router-dom";

// components
import InputComponent from "../../../components/appForm/Input/InputComponent";
import Spinner from "../../../components/spinners/Spinner";
import CategoriesAndBrandsConfigFormBtns from "./components/CategoriesAndBrandsConfigFormBtns";

// react query
import { useQuery } from "@tanstack/react-query";

// utils
import axios from "axios";

// types
import type { CategoryAndBrandType } from "../../../utils/types";

// hooks
import useHandleErrorMsg from "../../../hooks/useHandleErrorMsg";
import useSubmitCategoriesAndBrandsConfigForm from "../../../hooks/useSubmitCategoriesAndBrandsConfigForm";

// icons
import { IoCaretBackCircleSharp } from "react-icons/io5";

type Props = {
  type: "categories" | "brands";
};

// fetchers
const getSingleModelQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, type, id],
}: {
  queryKey: string[];
}) => {
  return (await axios(`${type}/${id}`)).data;
};

const CategoriesAndBrandsConfigPage = ({ type }: Props) => {
  // react router
  const id = useSearchParams()[0].get("id");

  // hooks
  const handleError = useHandleErrorMsg();

  // constants
  const modelName = type === "brands" ? "brand" : "category";

  // refs
  const formRef = useRef<HTMLFormElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // states
  const [oldModel, setOldModel] = useState<CategoryAndBrandType | undefined>();

  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState(id ? oldModel?.name || "" : "");

  // react query

  // get model
  const {
    data: singleModel,
    isPending: singleModelLoading,
    isError: singleModelErr,
    error: singleModelErrData,
    refetch: getSingleModel,
    fetchStatus,
  } = useQuery({
    queryKey: [`get single ${modelName}`, type, id || ""],
    queryFn: getSingleModelQueryFn,
    enabled: false,
  });

  const { modelLoading, editModelLoading, handleSubmit } =
    useSubmitCategoriesAndBrandsConfigForm({
      type,
      id,
      name,
      image,
      setName,
      setImage,
      imgInputRef,
      formRef,
      modelName,
      oldModel,
    });

  useEffect(() => {
    if (id) getSingleModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleModel) {
      setOldModel(singleModel);
      setName(singleModel.name);
    }
    if (singleModelErr) handleError(singleModelErrData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleModel, singleModelErr, singleModelErrData]);

  if (singleModelLoading && fetchStatus === "fetching") {
    return <Spinner fullWidth>Loading {modelName} Data...</Spinner>;
  }

  return (
    <>
      <Link
        data-disabled={modelLoading || editModelLoading}
        className="btn"
        to={`/dashboard/${type}`}
        relative="path"
        style={{
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <IoCaretBackCircleSharp size={20} />
        back to {type}
      </Link>

      <form onSubmit={handleSubmit}>
        <InputComponent
          placeholder={`${modelName} name...`}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          disabled={modelLoading}
        />

        {(image || oldModel?.image.secure_url) && (
          <img
            src={
              image ? URL.createObjectURL(image) : oldModel?.image.secure_url
            }
            alt={`${modelName} image`}
            width={100}
            height={100}
            style={{
              padding: 4,
              borderRadius: "100%",
              border: "var(--brdr)",
              objectFit: "contain",
              aspectRatio: 1,
              width: "unset",
              marginInline: "auto",
            }}
          />
        )}

        <input
          ref={imgInputRef}
          type="file"
          id="category-or-brand-img"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.currentTarget.files?.[0];
            if (file) setImage(file);
          }}
          accept="image/*"
        />
        <label
          htmlFor="category-or-brand-img"
          className="btn"
          style={{
            marginInline: "auto",
            width: "fit-content",
          }}
          data-disabled={modelLoading}
        >
          {image || oldModel?.image.secure_url ? "change" : "choose"} image for
          this {modelName}
        </label>

        <CategoriesAndBrandsConfigFormBtns
          editModelLoading={editModelLoading}
          id={id}
          image={image}
          imgInputRef={imgInputRef}
          setImage={setImage}
          setName={setName}
          oldModel={oldModel}
          modelLoading={modelLoading}
          modelName={modelName}
          name={name}
        />
      </form>
    </>
  );
};
export default CategoriesAndBrandsConfigPage;
