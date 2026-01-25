// react
import {
  useEffect,
  useRef,
  useState,

  // types
  type ChangeEvent,
  type FormEvent,
} from "react";

// react router
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// components
import BtnWithSpinner from "../../components/animatedBtns/BtnWithSpinner";
import InputComponent from "../../components/appForm/Input/InputComponent";
import Spinner from "../../components/spinners/Spinner";

// react query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
import useSelector from "../../hooks/redux/useSelector";
// redux actions
import { addCategoryOrBrand } from "../../store/fetures/categoriesAndBrandsSlice";

// utils
import axios from "axios";

// types
import type { CategoryAndBrandType } from "../../utils/types";

// hooks
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";
import useShowMsg from "../../hooks/useShowMsg";

// icons
import { IoCaretBackCircleSharp } from "react-icons/io5";

type Props = {
  type: "categories" | "brands";
};

type editOptions =
  | { name: string; image: File; initialImagePublicId: string }
  | { name?: never; image: File; initialImagePublicId: string }
  | { name: string; image?: never; initialImagePublicId: never };

// fetchers
const getSingleModelQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, type, id],
}: {
  queryKey: string[];
}) => {
  return (await axios(`${type}/${id}`)).data;
};

const submitModelMutationFn = async ({
  url,
  name,
  image,
}: {
  url: Props["type"];
  name: string;
  image: File;
}) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("image", image);

  return (
    await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};

const editModelMutationFn = async ({
  url,
  name,
  image,
  initialImagePublicId,
}: {
  url: `${Props["type"]}/${string}`;
} & editOptions): Promise<CategoryAndBrandType> => {
  const formData = new FormData();

  if (name) formData.append("name", name);
  if (image) {
    formData.append("image", image);
    formData.append("initialImagePublicId", initialImagePublicId);
  }

  return (
    await axios.patch(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};

const CategoriesAndBrandsConfigPage = ({ type }: Props) => {
  const queryClient = useQueryClient();

  // react router
  const navigate = useNavigate();
  const id = useSearchParams()[0].get("id");

  // hooks
  const handleError = useHandleErrorMsg();

  // redux
  const dispatch = useDispatch();
  const showMsg = useShowMsg();
  const initialEditableModel = useSelector(
    (state) => state.categoriesAndBrands[type]
  ).find((model) => model._id === id);

  // constants
  const modelName = type === "brands" ? "brand" : "category";

  // refs
  const formRef = useRef<HTMLFormElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // states
  const [editableModel, setEditableModel] = useState<
    CategoryAndBrandType | undefined
  >(initialEditableModel);

  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState(id ? editableModel?.name || "" : "");

  // react query
  // add new model
  const { mutate: submitModel, isPending: modelLoading } = useMutation({
    mutationKey: [`add new ${modelName}`],
    mutationFn: submitModelMutationFn,
    onSuccess(data) {
      showMsg?.({
        content: `${modelName} created successfully`,
        clr: "green",
        time: 4000,
      });
      dispatch(addCategoryOrBrand({ type, newCategoryOrBrand: data }));

      formRef.current?.reset();
      if (imgInputRef.current) imgInputRef.current.value = "";
      setName("");
      setImage(null);
    },
    onError(error) {
      handleError(error);
    },
  });

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

  // edit model
  const { mutate: editModel, isPending: editModelLoading } = useMutation({
    mutationKey: [`add new ${modelName}`],
    mutationFn: editModelMutationFn,
    onSuccess() {
      showMsg?.({
        content: `${modelName} updated successfully`,
        clr: "green",
        time: 4000,
      });

      queryClient.prefetchQuery({ queryKey: [`get ${type}`] });

      navigate(`/dashboard/${type}`, { relative: "path" });
    },
    onError(error) {
      handleError(error);
    },
  });

  // handlers
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (id) {
      const editData = {} as editOptions;

      if (name !== editableModel?.name) editData.name = name;
      if (image) {
        editData.image = image;
        editData.initialImagePublicId = editableModel?.image
          .public_id as string;
      }

      editModel({ url: `${type}/${id}`, ...editData });
    } else {
      if (!image) {
        showMsg?.({
          clr: "red",
          content: `${modelName} image is required`,
        });
        return;
      }

      submitModel({ url: type, name, image });
    }
  };

  useEffect(() => {
    if (id && !initialEditableModel) getSingleModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (singleModel) {
      setEditableModel(singleModel);
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

        {(image || editableModel?.image.secure_url) && (
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : editableModel?.image.secure_url
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
          {image || editableModel?.image.secure_url ? "change" : "choose"} image
          for this {modelName}
        </label>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <button
            disabled={modelLoading || editModelLoading}
            style={{ flex: 1 }}
            className="red-btn"
            type="button"
            onClick={() => {
              setImage(null);

              setName(id ? editableModel?.name || "" : "");
            }}
          >
            Reset
          </button>
          <BtnWithSpinner
            style={{ flex: 1 }}
            toggleSpinner={modelLoading || editModelLoading}
            className="btn"
            disabled={
              (id && name === editableModel?.name && !image) || // in edit mode
              (!id && !image && !name) || // in normal mode
              modelLoading ||
              editModelLoading
            }
          >
            {id ? "update" : "submit"} {modelName}
          </BtnWithSpinner>
        </div>
      </form>
    </>
  );
};
export default CategoriesAndBrandsConfigPage;
