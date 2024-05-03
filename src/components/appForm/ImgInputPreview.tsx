// react
import {
  useImperativeHandle,
  useState,
  forwardRef,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  MouseEvent,
  useEffect,
  useRef,
} from "react";

// react-hook-form
import { useForm } from "react-hook-form";

// components
import FormInput from "./Input/FormInput";
import ErrorDiv from "./Input/ErrorDiv";

// utiles
import { nanoid } from "@reduxjs/toolkit";
import convertFilesToBase64 from "../../utiles/functions/files/convertFilesToBase64";
import makeEmptyFile from "../../utiles/functions/files/makeEmptyFile";

// types
import { ProductFormValues } from "../../pages/products/ProductFormPage";

type HookFormMethodsType = ReturnType<typeof useForm<ProductFormValues>>;

type Props = {
  register: HookFormMethodsType["register"];
  imgErr: string | undefined;
};

export type ImgInputPreviewRefType = {
  imgsList: string[];
  setImgsList: Dispatch<SetStateAction<string[]>>;
};

const imgsMaxLegnth = 7;

const ImgInputPreview = forwardRef<ImgInputPreviewRefType, Props>(
  ({ imgErr, register }, ref) => {
    const addImgs = async (imgs: FileList) => {
      const finalImgs: string[] = [];

      for (let i = 0; i < imgs.length; i++) {
        if (!imgs?.length) break;
        const img = imgs[i as keyof typeof imgs] as File;

        const final = await convertFilesToBase64(img);
        finalImgs.push(final);
      }

      if (imgsList.length !== 7) {
        setImgsList((prev) => [
          ...prev,
          ...finalImgs.slice(0, imgsMaxLegnth - imgsList.length),
        ]);
      }
    };

    const imgRef2 = useRef<HTMLInputElement | null>(null);
    const { ref: imgRef, ...regist } = register("imgs", {
      required: "product must has at least one image",
      onChange: async (e: ChangeEvent<HTMLInputElement>) => {
        const imgs = e.currentTarget.files;
        if (imgs?.length) addImgs(imgs);
      },
    });

    const [imgsList, setImgsList] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({ imgsList, setImgsList }), [imgsList]);

    // fix bug with file input
    useEffect(() => {
      const input = imgRef2.current;
      const fileList = makeEmptyFile();

      if (input)
        input.files =
          imgsList.length === 0 ? new DataTransfer().files : fileList;
    }, [imgsList]);

    return (
      <div
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
            const fileList = new DataTransfer();
            files.forEach((file) => fileList.items.add(file));

            addImgs(fileList.files);
          }
        }}
      >
        <strong className="product-imgs-area-title">
          product images: {imgsList.length} / {imgsMaxLegnth}
        </strong>

        <div className="product-imgs-real-area">
          <ul className="preview-product-imgs-list">
            <li className="add-input-holder">
              <FormInput
                onClick={(e: MouseEvent<HTMLInputElement>) => {
                  e.currentTarget.value = null as unknown as string;
                }}
                ref={(e) => {
                  imgRef(e);
                  imgRef2.current = e;
                }}
                {...regist}
                disabled={imgsList.length === imgsMaxLegnth}
                id="imgs"
                type="file"
                multiple={true}
                accept="image/*"
                label="+"
              />
            </li>

            {imgsList.map((img, i) => (
              <li key={nanoid()} className="img-preview-cell">
                <img src={img} alt={"product image"} />
                <button
                  className="red-btn"
                  onClick={() =>
                    setImgsList((prev) =>
                      prev.filter((_, index) => i !== index)
                    )
                  }
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ErrorDiv msg={imgErr} />
      </div>
    );
  }
);
export default ImgInputPreview;
