// react
import {
  memo,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";

// react router dom
import { useParams } from "react-router-dom";

// components
import SortableItem from "../../../../../components/SortableItem";
import IconAndSpinnerSwitcher from "../../../../../components/animatedBtns/IconAndSpinnerSwitcher";
import InputComponent from "../../../../../components/appForm/Input/InputComponent";

// types
import type {
  ImageType,
  ProductType,
  ReplacementImage,
} from "../../../../../utils/types";
import type { AllProductImgsList, ImgsListItem } from "./ImgInputPreview";

// hooks
import useRemoveSingleImgFromProduct from "../../../../../hooks/useRemoveSingleImgFromProduct";
import useShowMsg from "../../../../../hooks/useShowMsg";

// icons
import { BiReset } from "react-icons/bi";
import { MdDelete, MdOutlineFindReplace } from "react-icons/md";

type Props = {
  img: ReplacementImage | ImgsListItem;
  product?: ProductType;
  setProduct: Dispatch<SetStateAction<ProductType | undefined>>;
  setAllImgs: Dispatch<SetStateAction<AllProductImgsList[]>>;
  isFormLoading: boolean;
};

const ProductFormImgItem = memo(
  ({ img, product, setProduct, setAllImgs, isFormLoading }: Props) => {
    const { id } = useParams();

    const replaceImgInputRef = useRef<HTMLInputElement>(null);

    const [replacementImg, setReplacementImg] = useState<File | undefined>();

    const serverImg = "secure_url" in img;
    const imgSrc = serverImg ? img.secure_url : URL.createObjectURL(img.img);
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

    const handleReplaceImg = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        if (serverImg) setReplacementImg(file);
        setAllImgs((prev) =>
          prev.map((imgItem) =>
            imgItem._id === img._id
              ? { ...imgItem, replacementImg: file }
              : imgItem
          )
        );
      }
    };

    const handleResetImg = () => {
      setReplacementImg(undefined);

      if (replaceImgInputRef.current) replaceImgInputRef.current.value = "";

      setAllImgs((prev) =>
        prev.map((imgItem) =>
          imgItem._id === img._id
            ? { ...imgItem, replacementImg: undefined }
            : imgItem
        )
      );
    };

    useEffect(() => {
      if ("replacementImg" in img && !img.replacementImg && replacementImg)
        setReplacementImg(undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [img]);

    if (!showImg) return;

    return (
      <SortableItem id={img._id}>
        <div className="img-preview-cell">
          <img
            src={
              replacementImg && serverImg
                ? URL.createObjectURL(replacementImg)
                : imgSrc
            }
            alt="product image"
            width="100%"
            height="100%"
          />

          <div className="img-preview-cell-btns-holder">
            {replacementImg && serverImg ? (
              <button
                title="reset image btn"
                className="red-btn"
                onClick={handleResetImg}
                disabled={removeImgLoading || isFormLoading}
                type="button"
                style={{ flex: 1 }}
              >
                <BiReset />
              </button>
            ) : (
              <button
                title="remove image from list btn"
                className="red-btn"
                onClick={(e) => handleRemoveImg(e, serverImg, img)}
                disabled={removeImgLoading || isFormLoading}
                type="button"
                style={{ flex: 1 }}
              >
                <IconAndSpinnerSwitcher
                  icon={<MdDelete />}
                  toggleIcon={removeImgLoading}
                />
              </button>
            )}

            <InputComponent
              ref={replaceImgInputRef}
              onChange={handleReplaceImg}
              disabled={removeImgLoading || isFormLoading}
              type="file"
              accept="image/*"
              title={`replace-img-${img._id}`}
              id={`replace-img-${img._id}`}
              label={<MdOutlineFindReplace />}
              labelAttr={{
                className: "btn",
                style: { flex: 1, display: "grid", placeContent: "center" },
              }}
            />
          </div>
        </div>
      </SortableItem>
    );
  }
);
export default ProductFormImgItem;
