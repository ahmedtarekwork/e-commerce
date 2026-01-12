// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// redux
import useDispatch from "./redux/useDispatch";
// redux actions
import { addProducts, editProduct } from "../store/fetures/productsSlice";

// utils
import axios from "../utils/axios";

// hooks
import useHandleErrorMsg from "./useHandleErrorMsg";
import useShowMsg from "./useShowMsg";

// types
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { SubmitHandler, UseFormReset } from "react-hook-form";
import type { ImgInputPreviewRefType } from "../pages/products/productsFormPage/components/ImgInputPreview/ImgInputPreview";
import type { ProductSelectedCategoryAndBrandRefType } from "../pages/products/productsFormPage/components/ProductSelectedCategoryAndBrand";
import type {
  ProductFormValues,
  requestProductType,
} from "../pages/products/productsFormPage/ProductFormPage";
import type { ProductType } from "../utils/types";

type MutateFnArgumentsType<T> = {
  productData: Omit<requestProductType, "category" | "brand" | "imgs"> & {
    category: string;
    brand: string;
    imgs: ({ order: number } & (
      | { public_id: string; img?: never }
      | { public_id?: never; img: File }
    ))[];
  };
} & (T extends "patch" ? { productId: string } : { productId?: never });

type Props = {
  id?: string;
  setImgErr: Dispatch<SetStateAction<string>>;
  reset: UseFormReset<ProductFormValues>;
  imgsList: RefObject<ImgInputPreviewRefType>;
  isEditMode: boolean;
  product?: ProductType;
} & Record<
  "categoriesListRef" | "brandsListRef",
  RefObject<ProductSelectedCategoryAndBrandRefType>
>;

// fetchers
const addOrUpdateProductMutationFn = <T extends "patch" | "post">(type: T) => {
  return async ({ productData, productId }: MutateFnArgumentsType<T>) => {
    const formData = new FormData();

    Object.entries(productData).forEach(([key, value]) => {
      if (key === "imgs") {
        return (value as (typeof productData)["imgs"])
          .sort((a, b) => a.order - b.order)
          .forEach((img) => {
            formData.append(
              "imgs[]",
              "img" in img ? (img.img as File) : img.public_id
            );
          });
      }

      formData.append(key, value.toString());
    });

    return (
      await axios[type](
        `/products${type === "patch" ? `/${productId}` : ""}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
    ).data;
  };
};

const useSubmitProductForm = ({
  setImgErr,
  reset,
  imgsList,
  id,
  isEditMode,
  product,
  categoriesListRef,
  brandsListRef,
}: Props) => {
  const showMsg = useShowMsg();
  const handleError = useHandleErrorMsg();
  const queryClient = useQueryClient();

  // redux
  const dispatch = useDispatch();

  // make a new product
  const { isPending: addProductLoading, mutate: addProductMutate } =
    useMutation({
      mutationKey: ["addProduct"],
      mutationFn: addOrUpdateProductMutationFn("post"),
      onSuccess(data) {
        if (data) {
          showMsg?.({
            clr: "green",
            content: "product created successfully",
          });

          dispatch(addProducts([data as ProductType]));
          queryClient.invalidateQueries({ queryKey: ["getProducts"] });

          reset();

          categoriesListRef?.current?.setSelectedItem("");
          brandsListRef?.current?.setSelectedItem("");

          imgsList.current?.setAllImgs([]);
        }
      },
      onError(error) {
        handleError(
          error,
          { forAllStates: "something went wrong while makeing a new product" },
          5000
        );
      },
    });

  // edit existing product
  const { mutate: editProductMutate, isPending: editProductLoading } =
    useMutation({
      mutationKey: ["edit-product", id],
      mutationFn: addOrUpdateProductMutationFn("patch"),
      onSuccess(data) {
        dispatch(editProduct(data as ProductType));
        queryClient.prefetchQuery({ queryKey: ["getProducts"] });
        queryClient.prefetchQuery({ queryKey: ["getSingleProduct", id] });

        showMsg?.({
          clr: "green",
          content: "product updated successfully",
        });
      },
      onError(error) {
        handleError(
          error,
          { forAllStates: "something went wrong while updating product info" },
          5000
        );
      },
    });

  const handler: SubmitHandler<ProductFormValues> = (data, e) => {
    e?.preventDefault();

    const selectedCategory = categoriesListRef?.current?.selectedItem;
    const selectedBrand = brandsListRef?.current?.selectedItem;

    if (!imgsList.current?.allImgs.length) {
      return setImgErr("product must have at least one image");
    }

    if (!selectedBrand || !selectedCategory) {
      return showMsg?.({
        clr: "red",
        content: `please select a ${
          !selectedBrand ? "brand" : "category"
        } for this product`,
      });
    }

    const productData = {
      ...data,
      category: selectedCategory,
      brand: selectedBrand,
      imgs: imgsList.current?.allImgs.map((img) => {
        const finalImg = { order: img.order } as Record<string, unknown>;

        if (!("secure_url" in img)) {
          finalImg.img = img.img;
        } else {
          finalImg.public_id = img.public_id;
        }

        return finalImg;
      }) as unknown as MutateFnArgumentsType<"patch">["productData"]["imgs"],
    };

    if (isEditMode) {
      if (!id) {
        return showMsg?.({
          clr: "red",
          content: "product id not found",
        });
      }

      if (product) {
        const deletedKeys = {
          ratings: true,
          imgs: !productData.imgs.length,
          quantity: isNaN(+data.quantity),
        };

        // TODO: loop in server imgs and see if the order changes or not => if not remove it from productData
        Object.entries(product).forEach(([oldKey, oldValue]) => {
          if (deletedKeys[oldKey as keyof typeof deletedKeys]) {
            delete productData[oldKey as keyof typeof productData];

            return;
          }

          const newValue = productData[oldKey as keyof typeof productData];

          const finalOldValue = ["category", "brand"].includes(oldKey)
            ? (oldValue as ProductType["brand" | "category"])?._id
            : oldValue;

          if (newValue === finalOldValue) {
            delete productData[oldKey as keyof typeof productData];
          }
        });

        editProductMutate({ productData, productId: id });
      } else
        showMsg?.({
          clr: "red",
          content: "something went wrong while updating product info",
        });
    } else {
      addProductMutate({
        productData,
      });
    }
  };

  return { handler, isLoading: addProductLoading || editProductLoading };
};

export default useSubmitProductForm;
