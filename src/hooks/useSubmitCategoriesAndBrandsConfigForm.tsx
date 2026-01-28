// react
import { Dispatch, RefObject, SetStateAction, type FormEvent } from "react";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// react router dom
import { useNavigate } from "react-router-dom";

// hooks
import useHandleErrorMsg from "./useHandleErrorMsg";
import useShowMsg from "./useShowMsg";

// utils
import axios from "../utils/axios";

// types
import type { CategoryAndBrandType } from "../utils/types";

type editOptions =
  | { name: string; image: File; initialImagePublicId: string }
  | { name?: never; image: File; initialImagePublicId: string }
  | { name: string; image?: never; initialImagePublicId: never };

export type SubmitCategoriesAndBrandsFormProps = {
  id: string | null;
  type: "categories" | "brands";
  modelName: "category" | "brand";
  setName: Dispatch<SetStateAction<string>>;
  setImage: Dispatch<SetStateAction<File | null>>;
  image: File | null;
  name: string;
  imgInputRef: RefObject<HTMLInputElement>;
  formRef: RefObject<HTMLFormElement>;
  oldModel?: CategoryAndBrandType;
};

const submitModelMutationFn = async ({
  url,
  name,
  image,
}: {
  url: SubmitCategoriesAndBrandsFormProps["type"];
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
  url: `${SubmitCategoriesAndBrandsFormProps["type"]}/${string}`;
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

const useSubmitCategoriesAndBrandsConfigForm = ({
  type,
  modelName,
  setName,
  setImage,
  formRef,
  imgInputRef,
  image,
  name,
  oldModel,
  id,
}: SubmitCategoriesAndBrandsFormProps) => {
  const queryClient = useQueryClient();

  // react router
  const navigate = useNavigate();

  // hooks
  const handleError = useHandleErrorMsg();

  const showMsg = useShowMsg();

  const { mutate: submitModel, isPending: modelLoading } = useMutation({
    mutationKey: [`add new ${modelName}`],
    mutationFn: submitModelMutationFn,
    onSuccess() {
      showMsg?.({
        content: `${modelName} created successfully`,
        clr: "green",
        time: 4000,
      });

      queryClient.prefetchQuery({ queryKey: [`get ${type}`] });

      formRef.current?.reset();
      if (imgInputRef.current) imgInputRef.current.value = "";
      setName("");
      setImage(null);
    },
    onError(error) {
      handleError(error);
    },
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (id) {
      const editData = {} as editOptions;

      if (name !== oldModel?.name) editData.name = name;
      if (image) {
        editData.image = image;
        editData.initialImagePublicId = oldModel?.image.public_id as string;
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

  return {
    handleSubmit,
    modelLoading,
    editModelLoading,
  };
};

export default useSubmitCategoriesAndBrandsConfigForm;
