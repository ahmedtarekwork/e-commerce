// react router dom
import { useParams } from "react-router-dom";

// types
import type { UseMutateFunction } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import type { Dispatch, MouseEvent, SetStateAction } from "react";
import type { ImageType } from "../../../../../utils/types";
import type { ImgsListItem } from "./ImgInputPreview";

// hooks
import useShowMsg from "../../../../../hooks/useShowMsg";

type Props = {
  img: ImageType | ImgsListItem;
  i: number;
  removeSingleImg: UseMutateFunction<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    AxiosResponse<any, any>,
    Error,
    Record<"imgPublicId" | "productId", string>,
    unknown
  >;
  setImgsList: Dispatch<SetStateAction<ImgsListItem[]>>;
};

const ProductFormImgItem = ({
  img,
  i,
  removeSingleImg,
  setImgsList,
}: Props) => {
  const { id } = useParams();

  // hooks
  const showMsg = useShowMsg();

  const serverImg = "secure_url" in img;

  // handlers
  const handleRemoveImg = async (
    e: MouseEvent<HTMLButtonElement>,
    i: number,
    serverImg: boolean,
    img: ImageType | ImgsListItem
  ) => {
    if (!serverImg) {
      return setImgsList((prev) => prev.filter((_, index) => i !== index));
    }

    if (id) {
      e.currentTarget.disabled = true;
      e.currentTarget.textContent = "removing...";

      return removeSingleImg({
        imgPublicId: (img as ImageType).public_id,
        productId: id,
      });
    }

    showMsg?.({
      clr: "red",
      content: "something went wrong while deleteing the image",
    });
  };

  return (
    <li key={img._id} className="img-preview-cell">
      <img
        src={serverImg ? img.secure_url : URL.createObjectURL(img.img)}
        alt="product image"
        width="100%"
        height="100%"
      />

      <button
        title="remove image from list btn"
        className="red-btn delete-product-img-btn"
        onClick={(e) => handleRemoveImg(e, i, serverImg, img)}
      >
        remove
      </button>
    </li>
  );
};
export default ProductFormImgItem;
