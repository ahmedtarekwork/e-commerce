// react
import { useEffect, useRef, useState } from "react";

// react-router-dom
import { useLocation, useParams, useNavigate } from "react-router-dom";

// react-hook-form
import { SubmitHandler, useForm } from "react-hook-form";

// redux
import useSelector from "../../../hooks/redux/useSelector";
import useDispatch from "../../../hooks/redux/useDispatch";
// actions
import { addProducts } from "../../../store/fetures/productsSlice";

// react query
import { useMutation, useQuery } from "@tanstack/react-query";

// components
import FormInput from "../../../components/appForm/Input/FormInput";
import ErrorDiv from "../../../components/appForm/Input/ErrorDiv";
import SplashScreen from "../../../components/spinners/SplashScreen";
import EmptyPage from "../../../components/layout/EmptyPage";
import DisplayError from "../../../components/layout/DisplayError";
import Heading from "../../../components/Heading";
import IconAndSpinnerSwitcher from "../../../components/animatedBtns/IconAndSpinnerSwitcher";

import TopMessage, {
  type TopMessageRefType,
} from "../../../components/TopMessage";
import ImgInputPreview, {
  type ImgInputPreviewRefType,
} from "./ImgInputPreview";

// utils
import handleError from "../../../utiles/functions/handleError";
import axios from "../../../utiles/axios";

// framer motion
import { motion } from "framer-motion";

// types
import type { ProductType } from "../../../utiles/types";

// icons
import { IoIosAddCircle } from "react-icons/io";

// SVGs
import IdRequiredSvg from "../../../../imgs/ID_required.svg";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

export type ProductFormValues = Omit<
  ProductType,
  "_id" | "ratings" | "totalRating"
> & {
  imgs: FileList;
};

export type requestProductType = Omit<
  ProductType,
  "_id" | "ratings" | "totalRating"
>;

// fetchers
const getSingleProductQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, productId],
}: {
  queryKey: [string, string];
}) => {
  return (await axios.get(`products/${productId}`)).data;
};

const addProductMutationFn = async (productData: requestProductType) => {
  return (await axios.post("/products", productData)).data;
};

const editProductMutationFn = async ({
  productData,
  prdId,
}: {
  productData: requestProductType;
  prdId: string;
}) => {
  return (await axios.put("products/" + prdId, productData)).data;
};

const NewProductPage = () => {
  // react-router-dom
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = pathname.includes("/edit-product");

  // redux
  const disaptch = useDispatch();
  const appProduct = useSelector((state) =>
    state.products.products.find((prd) => prd._id === (id || ""))
  );

  const [product, setProduct] = useState<ProductType | undefined>(appProduct);

  // refs
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const imgsList = useRef<ImgInputPreviewRefType>(null);
  const msgRef = useRef<TopMessageRefType>(null);

  // react query
  const {
    refetch: getResProduct,
    data: resProduct,
    isError: resProductErr,
    error: resProductErrData,
    isPending: resProductLoading,
    fetchStatus: resProductFetchStatus,
  } = useQuery({
    queryKey: ["getSingleProduct", id || ""],
    queryFn: getSingleProductQueryFn,
    enabled: false,
  });

  // make a new product
  const {
    data: productData,
    isPending: productLoading,
    mutate: addProductMutate,
    status: productStatus,
    isError: productErr,
    error: productErrData,
  } = useMutation({
    mutationKey: ["addProduct"],
    mutationFn: addProductMutationFn,
  });
  // edit existing product
  const {
    mutate: editProductMutate,
    isSuccess: editSuccess,
    isPending: editLoading,
    isError: editErr,
    error: editErrData,
    status: editStatus,
  } = useMutation({
    mutationKey: ["edit-product", id],
    mutationFn: editProductMutationFn,
  });

  // react-hook-form
  const form = useForm<ProductFormValues>();
  const { handleSubmit, register, formState, reset, setValue, setError } = form;
  const { errors } = formState;
  const {
    brand: brandErr,
    category: catErr,
    color: clrErr,
    imgs: imgErr,
    price: priceErr,
    quantity: qtyErr,
    title: titleErr,
    description: disErr,
  } = errors;

  const onSubmit: SubmitHandler<ProductFormValues> = (data, e) => {
    e?.preventDefault();

    if (!imgsList.current?.imgsList.length) {
      return setError("imgs", {
        type: "required",
        message: "product must has at least one image",
      });
    }

    const productData: requestProductType = {
      ...data,
      imgs: imgsList.current?.imgsList,
    };

    if (isEditMode) {
      if (!id) return console.error("the product id not found!");
      editProductMutate({ productData, prdId: id });
    } else {
      addProductMutate(productData);
    }
  };

  useEffect(() => {
    if (!product && id) getResProduct();
  }, [id, product]);

  useEffect(() => {
    if (resProduct) setProduct(resProduct);
  }, [resProduct]);

  // if the page is edit product => fill in form inputs with product data
  useEffect(() => {
    if (isEditMode) {
      if (id) {
        if (product) {
          type KeysArrType = (keyof Omit<
            ProductFormValues,
            "_id" | "imgs" | "ratings" | "totalRatings"
          >)[];

          const keysArr = Object.keys(product).filter((key) =>
            ["totalRatings", "ratings", "_id", "imgs"].every(
              (prop) => prop !== key
            )
          ) as KeysArrType;

          keysArr.forEach((key) => setValue(key, product[key]));

          imgsList.current?.setImgsList(product.imgs);
        }
      }
    }
  }, []);

  // showing spinner inside submit btn while sending request to the server to adding new product
  useEffect(() => {
    submitBtnRef.current?.classList.toggle(
      "active",
      productLoading || editLoading
    );
  }, [productLoading, editLoading]);

  useEffect(() => {
    if (productStatus !== "idle") {
      if (productData) {
        msgRef.current?.setMessageData?.({
          clr: "green",
          content: "product created successfully",
          show: true,
          time: 3500,
        });
        disaptch(addProducts([productData]));
        reset();
        imgsList.current?.setImgsList([]);
      }

      if (productErr) {
        handleError(
          productErrData,
          msgRef,
          { forAllStates: "something went wrong while makeing a new product" },
          5000
        );
      }
    }
  }, [productData, productStatus, productErr, disaptch, productErrData, reset]);

  useEffect(() => {
    if (editStatus !== "idle") {
      if (editSuccess) {
        navigate("/dashboard/products", { relative: "path" });
      }

      if (editErr) {
        handleError(
          editErrData,
          msgRef,
          { forAllStates: "something went wrong while updating product info" },
          5000
        );
      }
    }
  }, [editStatus, editErr, editErrData, editSuccess, navigate]);

  if (isEditMode && resProductLoading && resProductFetchStatus !== "idle") {
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
      <Heading>
        {isEditMode
          ? `Edit ${product?.title ? `"${product.title}"` : "The Product"}`
          : "make a new product"}
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
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
        <FormInput
          errorMsg={catErr?.message}
          placeholder="product category"
          {...register("category", {
            required: "category is required",
          })}
        />
        <FormInput
          errorMsg={brandErr?.message}
          placeholder="brand name"
          {...register("brand", {
            required: "brand name is required",
          })}
        />
        <FormInput
          type="number"
          errorMsg={qtyErr?.message}
          placeholder="product quantity"
          {...register("quantity", {
            valueAsNumber: true,
            required: "quantity is required",
          })}
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
          register={register}
          imgErr={imgErr?.message}
        />

        <button
          title={isEditMode ? "save new changes" : "add product"}
          ref={submitBtnRef}
          disabled={productLoading || editLoading}
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
            toggleIcon={productLoading || editLoading}
            icon={<IoIosAddCircle />}
          />
          {isEditMode ? "Save Changes" : "Add product"}
        </button>
      </form>

      <TopMessage ref={msgRef} />
    </AnimatedLayout>
  );
};
export default NewProductPage;
