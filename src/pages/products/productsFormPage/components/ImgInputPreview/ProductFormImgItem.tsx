// react
import {
  memo,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";

// react router dom
import { useParams } from "react-router-dom";

// components
import SortableItem from "../../../../../components/SortableItem";

// types
import type { ImageType, ProductType } from "../../../../../utils/types";
import type { AllProductImgsList, ImgsListItem } from "./ImgInputPreview";

// hooks
import useRemoveSingleImgFromProduct from "../../../../../hooks/useRemoveSingleImgFromProduct";
import useShowMsg from "../../../../../hooks/useShowMsg";

type Props = {
  img: ImageType | ImgsListItem;
  product?: ProductType;
  setProduct: Dispatch<SetStateAction<ProductType | undefined>>;
  setAllImgs: Dispatch<SetStateAction<AllProductImgsList[]>>;
};

const ProductFormImgItem = memo(
  ({ img, product, setProduct, setAllImgs }: Props) => {
    const { id } = useParams();

    const serverImg = "secure_url" in img;

    const showImg = serverImg ? img.secure_url : img.img;

    // hooks
    const showMsg = useShowMsg();

    // react query
    const { mutate: removeSingleImg, isPending: removeImgLoading } =
      useRemoveSingleImgFromProduct({
        product,
        setProduct,
      });

    // handlers
    const handleRemoveImg = async (
      e: MouseEvent<HTMLButtonElement>,
      serverImg: boolean,
      img: ImageType | ImgsListItem
    ) => {
      e.stopPropagation();
      if (!serverImg) {
        return setAllImgs((prev) =>
          prev
            .filter(({ _id }) => _id !== img._id)
            .sort((a, b) => a.order - b.order)
            .map((img, index) => ({
              ...img,
              order: index,
            }))
        );
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

    if (!showImg) return;

    return (
      <SortableItem id={img._id}>
        <div className="img-preview-cell">
          <img
            src={serverImg ? img.secure_url : URL.createObjectURL(img.img)}
            alt="product image"
            width="100%"
            height="100%"
          />

          <button
            title="remove image from list btn"
            className="red-btn delete-product-img-btn"
            onClick={(e) => handleRemoveImg(e, serverImg, img)}
            disabled={removeImgLoading}
            type="button"
            data-no-dnd="true"
          >
            remove
          </button>
        </div>
      </SortableItem>
    );
  }
);
export default ProductFormImgItem;
