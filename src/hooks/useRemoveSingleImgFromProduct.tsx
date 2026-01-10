// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// react router dom
import { useParams } from "react-router-dom";

// types
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { ImageType, ProductType } from "../utils/types";

// hooks
import useHandleErrorMsg from "./useHandleErrorMsg";
import useShowMsg from "./useShowMsg";

// utils
import axios from "../utils/axios";

type Props = {
  listRef: RefObject<HTMLUListElement>;
  setInitImgs: Dispatch<SetStateAction<ImageType[]>>;
  product?: ProductType;
  setProduct: Dispatch<SetStateAction<ProductType | undefined>>;
};

const removeSingleProductImageMutationFn = async ({
  imgPublicId,
  productId,
}: Record<"imgPublicId" | "productId", string>) => {
  return await axios.delete(`/products/deleteImgs/${productId}`, {
    data: { imgs: [imgPublicId] },
  });
};

const useRemoveSingleImgFromProduct = ({
  listRef,
  setInitImgs,
  product,
  setProduct,
}: Props) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const showMsg = useShowMsg();
  const handleError = useHandleErrorMsg();

  return useMutation({
    mutationKey: ["delete product image", id],
    mutationFn: removeSingleProductImageMutationFn,
    onError(error) {
      handleError(error, {
        forAllStates: "something went wrong while deleteing the image",
      });

      (
        [
          ...listRef.current!.querySelectorAll("button.delete-product-img-btn"),
        ] as HTMLButtonElement[]
      ).forEach((btn) => {
        btn.disabled = false;
        btn.textContent = "remove";
      });
    },
    onSuccess(data, { imgPublicId }) {
      showMsg?.({
        clr: "green",
        content:
          "message" in data
            ? (data.message as string)
            : "image deleted successfully",
      });

      queryClient.prefetchQuery({ queryKey: ["getSingleProduct", id] });

      setInitImgs((prev) =>
        prev.filter(({ public_id }) => public_id !== imgPublicId)
      );

      if (product) {
        setProduct({
          ...product,
          imgs: product.imgs.filter(
            ({ public_id }) => public_id !== imgPublicId
          ),
        });
      }
    },
  });
};

export default useRemoveSingleImgFromProduct;
