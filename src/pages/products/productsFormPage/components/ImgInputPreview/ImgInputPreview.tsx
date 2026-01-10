// react
import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Dispatch,
  // types
  type SetStateAction,
} from "react";

// components
import ErrorDiv from "../../../../../components/appForm/Input/ErrorDiv";
import FormInput from "../../../../../components/appForm/Input/FormInput";

// utils
import { nanoid } from "@reduxjs/toolkit";

// types
import type { ImageType, ProductType } from "../../../../../utils/types";

// hooks
import useRemoveSingleImgFromProduct from "../../../../../hooks/useRemoveSingleImgFromProduct";

// framer motion
import { motion } from "framer-motion";
import ProductFormImgItem from "./ProductFormImgItem";

type Props = {
  imgErr: string;
  product: ProductType | undefined;
  setProduct: Dispatch<SetStateAction<ProductType | undefined>>;
};

export type ImgsListItem = { img: File; _id: string };

export type ImgInputPreviewRefType = {
  imgsList: ImgsListItem[];
  setImgsList: Dispatch<SetStateAction<ImgsListItem[]>>;

  initImgs: ImageType[];
  setInitImgs: Dispatch<SetStateAction<ImageType[]>>;
};

const imgsMaxLegnth = 7;

const ImgInputPreview = forwardRef<ImgInputPreviewRefType, Props>(
  ({ imgErr, product, setProduct }, ref) => {
    // states
    const [imgsList, setImgsList] = useState<ImgsListItem[]>([]);
    const [initImgs, setInitImgs] = useState<ImageType[]>([]);

    // refs
    const listRef = useRef<HTMLUListElement>(null);

    // react query
    const {
      mutate: removeSingleImg,
      isPending: removeImgLoading,
      status,
    } = useRemoveSingleImgFromProduct({
      listRef,
      setInitImgs,
      product,
      setProduct,
    });

    useImperativeHandle(
      ref,
      () => ({ imgsList, setImgsList, setInitImgs, initImgs }),
      [imgsList, initImgs]
    );

    useEffect(() => {
      if (!removeImgLoading && status === "idle") {
        (
          [
            ...listRef.current!.querySelectorAll(
              "button.delete-product-img-btn"
            ),
          ] as HTMLButtonElement[]
        ).forEach((btn) => {
          btn.disabled = false;
          btn.textContent = "remove";
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removeImgLoading]);

    const handleAddNewImg = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;

      if (files) {
        const finalImgs: typeof imgsList = [];

        for (let i = 0; i < files?.length; i++) {
          finalImgs.push({
            img: files.item(i) as File,
            _id: nanoid(),
          });
        }

        setImgsList((prev) => [...prev, ...finalImgs]);
      }
    };

    return (
      <motion.div
        layout
        transition={{
          type: "tween",
          duration: 0.15,
          ease: "easeInOut",
        }}
        className="product-imgs-area"
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();

          e.currentTarget.classList.remove("drag-over");
        }}
        onDragOver={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!e.currentTarget.classList.contains("drag-over"))
            e.currentTarget.classList.add("drag-over");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.remove("drag-over");

          const files = [...e.dataTransfer.files].filter((file) =>
            file.type.startsWith("image")
          );

          if (files.length) {
            setImgsList((prev) => [
              ...prev,
              ...files.map((file) => ({ img: file, _id: nanoid() })),
            ]);
          }
        }}
      >
        <strong className="product-imgs-area-title">
          product images: {imgsList.length + initImgs.length} / {imgsMaxLegnth}
        </strong>

        <div className="product-imgs-real-area">
          <ul className="preview-product-imgs-list" ref={listRef}>
            <li className="add-input-holder">
              <FormInput
                onChange={handleAddNewImg}
                disabled={imgsList.length === imgsMaxLegnth}
                id="imgs"
                type="file"
                multiple
                accept="image/*"
                label="+"
              />
            </li>

            {[...initImgs, ...imgsList].map((img, i) => (
              <ProductFormImgItem
                img={img}
                i={i}
                removeSingleImg={removeSingleImg}
                setImgsList={setImgsList}
              />
            ))}
          </ul>
        </div>

        <ErrorDiv msg={imgErr} />
      </motion.div>
    );
  }
);

export default ImgInputPreview;
