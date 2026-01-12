// react
import { useEffect, useRef, useState } from "react";

// react-router-dom
import { Link, useLocation, useParams } from "react-router-dom";

// react-hook-form
import { useForm } from "react-hook-form";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import Heading from "../../../components/Heading";
import IconAndSpinnerSwitcher from "../../../components/animatedBtns/IconAndSpinnerSwitcher";
import ErrorDiv from "../../../components/appForm/Input/ErrorDiv";
import FormInput from "../../../components/appForm/Input/FormInput";
import DisplayError from "../../../components/layout/DisplayError";
import EmptyPage from "../../../components/layout/EmptyPage";
import SplashScreen from "../../../components/spinners/SplashScreen";
import ProductQTY from "./components/ProductQTY";

import ImgInputPreview, {
  type ImgInputPreviewRefType,
} from "./components/ImgInputPreview/ImgInputPreview";

// utils
import axios from "../../../utils/axios";

// hooks
import useSubmitProductForm from "../../../hooks/useSubmitProductForm";

// framer motion
import { motion } from "framer-motion";

// types
import type { ImageType, ProductType } from "../../../utils/types";

// icons
import { IoIosAddCircle } from "react-icons/io";
import { IoCaretBackCircleSharp } from "react-icons/io5";

// SVGs
import IdRequiredSvg from "../../../../imgs/ID_required.svg";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";
import ProductSelectedCategoryAndBrand, {
  ProductSelectedCategoryAndBrandRefType,
} from "./components/ProductSelectedCategoryAndBrand";

export type ProductFormValues = Omit<
  ProductType,
  "_id" | "ratings" | "totalRating"
>;

export type requestProductType = Omit<
  ProductType,
  "_id" | "ratings" | "totalRating" | "imgs"
> & {
  imgs: File[];
};

// fetchers
const getSingleProductQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, productId],
}: {
  queryKey: [string, string];
}) => {
  return (await axios.get(`products/${productId}`)).data;
};

const NewProductPage = () => {
  // react-router-dom
  const { pathname } = useLocation();
  const { id } = useParams();

  const isEditMode = pathname.includes("/edit-product");

  // states
  const [product, setProduct] = useState<ProductType | undefined>(undefined);
  const [imgErr, setImgErr] = useState("");

  // refs
  const imgsList = useRef<ImgInputPreviewRefType>(null);
  const categoriesListRef =
    useRef<ProductSelectedCategoryAndBrandRefType>(null);
  const brandsListRef = useRef<ProductSelectedCategoryAndBrandRefType>(null);

  const isFirstRender = useRef(true);

  // react query

  // get single product "if edit mode"
  const {
    data: resProduct,
    isError: resProductErr,
    error: resProductErrData,
    isPending: resProductLoading,
    fetchStatus: resProductFetchStatus,
  } = useQuery({
    queryKey: ["getSingleProduct", id || ""],
    queryFn: getSingleProductQueryFn,
    enabled: isEditMode && !!id,
  });

  // react-hook-form
  const form = useForm<ProductFormValues>();
  const { handleSubmit, register, formState, reset, setValue, watch } = form;
  const { errors } = formState;
  const {
    color: clrErr,
    price: priceErr,
    quantity: qtyErr,
    title: titleErr,
    description: disErr,
  } = errors;

  const { handler, isLoading } = useSubmitProductForm({
    setImgErr,
    reset,
    imgsList,
    isEditMode,
    id,
    product,
    categoriesListRef,
    brandsListRef,
  });

  useEffect(() => {
    if (resProduct) {
      setProduct(resProduct);
      Object.entries(resProduct).forEach(
        ([key, val]) =>
          key !== "quantity" &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setValue(key as keyof requestProductType, val as any)
      );
      if (resProduct.brand?._id)
        brandsListRef.current?.setSelectedItem(resProduct.brand._id);
      if (resProduct.category?._id)
        categoriesListRef.current?.setSelectedItem(resProduct.category._id);

      imgsList.current?.setAllImgs((prev) =>
        // TODO: REMOVE CHEKCS FOR TYPES AFTER REPLACE ALL PRODUCTS IMAGES IN THE APPLICATION
        {
          const oldServerImgs = prev.filter((img) => "public_id" in img);

          if (resProduct.imgs.length < oldServerImgs.length) {
            return [
              ...resProduct.imgs,
              ...prev.filter((img) => !("public_id" in img)),
            ].sort(
              (a: ImageType, b: ImageType) => (a.order || 0) - (b.order || 0)
            );
          }

          return resProduct.imgs.sort(
            (a: ImageType, b: ImageType) => (a.order || 0) - (b.order || 0)
          );
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resProduct]);

  if (
    isEditMode &&
    resProductLoading &&
    resProductFetchStatus !== "idle" &&
    isFirstRender.current
  ) {
    isFirstRender.current = false;
    return <SplashScreen children="Loading The Product..." />;
  }

  if (isEditMode && !id) {
    return (
      <EmptyPage
        svg={IdRequiredSvg}
        content="Product Id is required!"
        withBtn={{ type: "GoToHome" }}
      />
    );
  }

  if (isEditMode && resProductErr) {
    return (
      <DisplayError
        error={resProductErrData}
        initMsg="Can't get the product at the moment"
      />
    );
  }

  return (
    <AnimatedLayout>
      <Link
        to="/dashboard/products"
        relative="path"
        className="btn"
        style={{
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <IoCaretBackCircleSharp size={20} />
        back to products
      </Link>

      <Heading>
        {isEditMode
          ? `Edit ${product?.title ? `"${product.title}"` : "The Product"}`
          : "make a new product"}
      </Heading>

      <form onSubmit={handleSubmit(handler)}>
        <FormInput
          errorMsg={titleErr?.message}
          placeholder="product name"
          {...register("title", {
            required: "name is required",
          })}
        />
        <FormInput
          type="number"
          errorMsg={priceErr?.message}
          placeholder="product price"
          {...register("price", {
            valueAsNumber: true,
            required: "price is required",
          })}
        />

        <ProductSelectedCategoryAndBrand
          isLoading={isLoading}
          ref={categoriesListRef}
          type="category"
          product={product}
        />

        <ProductSelectedCategoryAndBrand
          isLoading={isLoading}
          ref={brandsListRef}
          type="brand"
          product={product}
        />

        <ProductQTY
          register={register}
          errorMsg={qtyErr?.message}
          oldQTY={product?.quantity}
          isEditMode={isEditMode}
          watch={watch}
        />

        <motion.div
          layout
          transition={{
            type: "tween",
            duration: 0.15,
            ease: "easeInOut",
          }}
          className="input-holder"
        >
          <textarea
            placeholder="Description"
            className={disErr?.message ? "red" : ""}
            {...register("description", {
              required: "description is required",
            })}
          />

          <ErrorDiv msg={disErr?.message} />
        </motion.div>

        <FormInput
          errorMsg={clrErr?.message}
          defaultValue="#000000"
          label="color: "
          id="color"
          type="color"
          placeholder="product color"
          {...register("color", {
            required: "color is required",
          })}
        />

        <ImgInputPreview
          ref={imgsList}
          imgErr={imgErr}
          product={product}
          setProduct={setProduct}
        />

        <button
          title={isEditMode ? "save new changes" : "add product"}
          disabled={isLoading}
          className="btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <IconAndSpinnerSwitcher
            spinnerDiminsions="20px"
            toggleIcon={isLoading}
            icon={<IoIosAddCircle />}
          />
          {isEditMode ? "Save Changes" : "Add product"}
        </button>
      </form>
    </AnimatedLayout>
  );
};
export default NewProductPage;
