// react
import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,

  // types
  type SetStateAction,
  type Dispatch,
  type MouseEvent,
} from "react";

// react router dom
import { useParams } from "react-router-dom";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// redux
import useDispatch from "../../../hooks/redux/useDispatch";
// redux acions
import { editProduct } from "../../../store/fetures/productsSlice";

// components
import FormInput from "../../../components/appForm/Input/FormInput";
import ErrorDiv from "../../../components/appForm/Input/ErrorDiv";

// utils
import axios from "axios";
import { nanoid } from "@reduxjs/toolkit";

// types
import type { ImageType, ProductType } from "../../../utils/types";

// hooks
import useHandleErrorMsg from "../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../hooks/useShowMsg";

// framer motion
import { motion } from "framer-motion";

type Props = {
  imgErr: string;
  product: ProductType | undefined;
  setProduct: Dispatch<SetStateAction<ProductType | undefined>>;
};

export type ImgInputPreviewRefType = {
  imgsList: { img: File; _id: string }[];
  setImgsList: Dispatch<SetStateAction<{ img: File; _id: string }[]>>;

  initImgs: ImageType[];
  setInitImgs: Dispatch<SetStateAction<ImageType[]>>;
};

const imgsMaxLegnth = 7;

const removeSingleProductImageMutationFn = async ({
  imgPublicId,
  productId,
}: Record<"imgPublicId" | "productId", string>) => {
  return await axios.delete(`/products/deleteImgs/${productId}`, {
    data: { imgs: [imgPublicId] },
  });
};

const ImgInputPreview = forwardRef<ImgInputPreviewRefType, Props>(
  ({ imgErr, product, setProduct }, ref) => {
    const handleError = useHandleErrorMsg();

    const queryClient = useQueryClient();

    // react router
    const { id } = useParams();

    // redux
    const dispatch = useDispatch();
    const showMsg = useShowMsg();

    // states
    const [imgsList, setImgsList] = useState<{ img: File; _id: string }[]>([]);
    const [initImgs, setInitImgs] = useState<ImageType[]>([]);

    // react query
    const {
      mutate: removeSingleImg,
      isPending: removeImgLoading,
      status,
    } = useMutation({
      mutationKey: ["delete product image", id],
      mutationFn: removeSingleProductImageMutationFn,
      onError(error) {
        handleError(error, {
          forAllStates: "something went wrong while deleteing the image",
        });

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

          dispatch(
            editProduct({
              ...product,
              imgs: product.imgs.filter(
                ({ public_id }) => public_id !== imgPublicId
              ),
            })
          );
        }
      },
    });

    // refs
    const imgInputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLUListElement>(null);

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
    }, [removeImgLoading]);

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
            // const fileList = new DataTransfer();
            // files.forEach((file) => fileList.items.add(file));

            // setImgsList((prev) => [...prev, ...fileList.files]);

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
                onChange={(e) => {
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
                }}
                ref={imgInputRef}
                disabled={imgsList.length === imgsMaxLegnth}
                id="imgs"
                type="file"
                multiple
                accept="image/*"
                label="+"
              />
            </li>

            {[...initImgs, ...imgsList].map((img, i) => {
              const serverImg = "secure_url" in img;

              return (
                <li key={img._id} className="img-preview-cell">
                  <img
                    src={
                      serverImg ? img.secure_url : URL.createObjectURL(img.img)
                    }
                    alt="product image"
                    width="100%"
                    height="100%"
                  />

                  <button
                    title="remove image from list btn"
                    className="red-btn delete-product-img-btn"
                    onClick={async (e: MouseEvent<HTMLButtonElement>) => {
                      if (!serverImg) {
                        return setImgsList((prev) =>
                          prev.filter((_, index) => i !== index)
                        );
                      }

                      if (id) {
                        e.currentTarget.disabled = true;
                        e.currentTarget.textContent = "removing...";

                        return removeSingleImg({
                          imgPublicId: img.public_id,
                          productId: id,
                        });
                      }

                      showMsg?.({
                        clr: "red",
                        content:
                          "something went wrong while deleteing the image",
                      });
                    }}
                  >
                    remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <ErrorDiv msg={imgErr} />
      </motion.div>
    );
  }
);

export default ImgInputPreview;
