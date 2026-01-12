// react
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  // types
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

// dnd kit
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

// components
import ErrorDiv from "../../../../../components/appForm/Input/ErrorDiv";
import FormInput from "../../../../../components/appForm/Input/FormInput";
import ProductFormImgItem from "./ProductFormImgItem";

// utils
import { nanoid } from "@reduxjs/toolkit";

// types
import type { ImageType, ProductType } from "../../../../../utils/types";

// framer motion
import { motion } from "framer-motion";

type Props = {
  imgErr: string;
  product: ProductType | undefined;
  setProduct: Dispatch<SetStateAction<ProductType | undefined>>;
};

export type ImgsListItem = { img: File; _id: string; order: number };
export type AllProductImgsList = (ImgsListItem | ImageType) & { order: number };

export type ImgInputPreviewRefType = {
  allImgs: AllProductImgsList[];
  setAllImgs: Dispatch<SetStateAction<AllProductImgsList[]>>;
};

const imgsMaxLegnth = 7;

const ImgInputPreview = forwardRef<ImgInputPreviewRefType, Props>(
  ({ imgErr, product, setProduct }, ref) => {
    // states
    const [allImgs, setAllImgs] = useState<AllProductImgsList[]>([]);

    const serverImgsList = allImgs.filter((img) => "secure_url" in img);

    // refs
    const listRef = useRef<HTMLUListElement>(null);

    useImperativeHandle(ref, () => ({ setAllImgs, allImgs }), [allImgs]);

    // handlers
    const handleAddNewImg = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files;

      if (files) {
        const finalImgs: ImgsListItem[] = [];

        for (let i = 0; i < files?.length; i++) {
          finalImgs.push({
            img: files.item(i) as File,
            _id: nanoid(),
            order: allImgs.length + i,
          });
        }

        setAllImgs((prev) => [...prev, ...finalImgs]);
      }
    };

    const handleSortImgs = (e: DragEndEvent) => {
      const { active, over } = e;

      if (active.id === over?.id) return;

      setAllImgs((prev) => {
        const oldIndex = prev.findIndex(({ _id }) => _id === active.id);
        const newIndex = prev.findIndex(({ _id }) => _id === over?.id);

        return arrayMove(prev, oldIndex, newIndex).map((img, i) => ({
          ...img,
          order: i,
        }));
      });
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
            setAllImgs((prev) => [
              ...prev,
              ...files.map((file, i) => ({
                img: file,
                _id: nanoid(),
                order: prev.length + i,
              })),
            ]);
          }
        }}
      >
        <strong className="product-imgs-area-title">
          product images: {allImgs.length} / {imgsMaxLegnth}
        </strong>

        <div className="product-imgs-real-area">
          <ul className="preview-product-imgs-list" ref={listRef}>
            <li className="add-input-holder">
              <FormInput
                onChange={handleAddNewImg}
                disabled={serverImgsList.length === imgsMaxLegnth}
                id="imgs"
                type="file"
                multiple
                accept="image/*"
                label="+"
              />
            </li>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleSortImgs}
            >
              <SortableContext items={allImgs.map(({ _id }) => ({ id: _id }))}>
                {allImgs
                  .sort(
                    (a: AllProductImgsList, b: AllProductImgsList) =>
                      // TODO: REMOVE ZEROS AFTER REPLACE PRODUCTS IMAGES IN THE APPLICATION
                      (a.order || 0) - (b.order || 0)
                  )
                  .map((img) => (
                    <ProductFormImgItem
                      key={img._id}
                      img={img}
                      product={product}
                      setProduct={setProduct}
                      setAllImgs={setAllImgs}
                    />
                  ))}
              </SortableContext>
            </DndContext>
          </ul>
        </div>

        <ErrorDiv msg={imgErr} />
      </motion.div>
    );
  }
);

export default ImgInputPreview;
