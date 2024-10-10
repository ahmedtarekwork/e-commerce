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
import { addProducts, editProduct } from "../../../store/fetures/productsSlice";
import { setCategoriesOrBrand } from "../../../store/fetures/categoriesAndBrandsSlice";

// react query
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// components
import FormInput from "../../../components/appForm/Input/FormInput";
import ErrorDiv from "../../../components/appForm/Input/ErrorDiv";
import SplashScreen from "../../../components/spinners/SplashScreen";
import EmptyPage from "../../../components/layout/EmptyPage";
import DisplayError from "../../../components/layout/DisplayError";
import Heading from "../../../components/Heading";
import IconAndSpinnerSwitcher from "../../../components/animatedBtns/IconAndSpinnerSwitcher";
import Spinner from "../../../components/spinners/Spinner";
import SelectList, {
  type SelectListComponentRefType,
} from "../../../components/selectList/SelectList";

import ImgInputPreview, {
  type ImgInputPreviewRefType,
} from "./ImgInputPreview";

// utils
import axios from "../../../utils/axios";

// hooks
import useGetBrandsOrCategories from "../../../hooks/ReactQuery/useGetBrandsOrCategories";
import useHandleErrorMsg from "../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../hooks/useShowMsg";

// framer motion
import { motion } from "framer-motion";

// types
import type { ProductType } from "../../../utils/types";

// icons
import { IoIosAddCircle } from "react-icons/io";

// SVGs
import IdRequiredSvg from "../../../../imgs/ID_required.svg";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

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

type MutateFnArgumentsType<T> = {
  productData: Omit<requestProductType, "category" | "brand"> & {
    category: string;
    brand: string;
  };
} & (T extends "patch" ? { productId: string } : { productId?: never });

// fetchers
const getSingleProductQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, productId],
}: {
  queryKey: [string, string];
}) => {
  return (await axios.get(`products/${productId}`)).data;
};

const addOrUpdateProductMutationFn = <T extends "patch" | "post">(type: T) => {
  return async ({ productData, productId }: MutateFnArgumentsType<T>) => {
    const formData = new FormData();

    Object.entries(productData).forEach(([key, value]) => {
      if (key === "imgs") {
        return (value as File[]).forEach((img) =>
          formData.append("imgs[]", img)
        );
      }

      formData.append(key, value.toString());
    });

    return (
      await axios[type](
        `/products${type === "patch" ? `/${productId}` : ""}`,
        productData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
    ).data;
  };
};

const NewProductPage = () => {
  const handleError = useHandleErrorMsg();
  const queryClient = useQueryClient();

  // react-router-dom
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = pathname.includes("/edit-product");

  // redux
  const dispatch = useDispatch();
  const showMsg = useShowMsg();
  const appProduct = useSelector((state) =>
    state.products.products.find((prd) => prd._id === (id || ""))
  );
  const appCategories = useSelector(
    (state) => state.categoriesAndBrands.categories
  );
  const appBrands = useSelector((state) => state.categoriesAndBrands.brands);

  // states
  const [product, setProduct] = useState<ProductType | undefined>(appProduct);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    product?.category._id || ""
  );
  const [selectedBrand, setSelectedBrand] = useState<string>(
    product?.brand._id || ""
  );
  const [imgErr, setImgErr] = useState("");

  // refs
  const imgsList = useRef<ImgInputPreviewRefType>(null);
  const categoriesListRef = useRef<SelectListComponentRefType>(null);
  const brandsListRef = useRef<SelectListComponentRefType>(null);

  const isFirestRender = useRef(true);

  // react query

  // get brands
  const {
    data: resBrands,
    isError: resBrandsErr,
    error: resBrandsErrData,
    refetch: getBrands,
    isPending: resBrandsLoading,
  } = useGetBrandsOrCategories("brands", undefined, false);

  // get categories
  const {
    data: resCategories,
    isError: resCategoriesErr,
    error: resCategoriesErrData,
    refetch: getCategories,
    isPending: resCategoriesLoading,
  } = useGetBrandsOrCategories("categories", undefined, false);

  // get single product "if edit mode"
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
  const { isPending: productLoading, mutate: addProductMutate } = useMutation({
    mutationKey: ["addProduct"],
    mutationFn: addOrUpdateProductMutationFn("post"),
    onSuccess(data) {
      if (data) {
        showMsg?.({
          clr: "green",
          content: "product created successfully",
        });

        dispatch(addProducts([data as ProductType]));
        queryClient.invalidateQueries({ queryKey: ["getProducts"] });

        reset();

        setSelectedBrand("");
        setSelectedCategory("");

        imgsList.current?.setImgsList([]);
        imgsList.current?.setInitImgs([]);
      }
    },
    onError(error) {
      handleError(
        error,
        { forAllStates: "something went wrong while makeing a new product" },
        5000
      );
    },
  });

  // edit existing product
  const { mutate: editProductMutate, isPending: editLoading } = useMutation({
    mutationKey: ["edit-product", id],
    mutationFn: addOrUpdateProductMutationFn("patch"),
    onSuccess(data) {
      dispatch(editProduct(data as ProductType));
      queryClient.prefetchQuery({ queryKey: ["getProducts"] });
      queryClient.prefetchQuery({ queryKey: ["getSingleProduct", id] });

      navigate("/dashboard/products", { relative: "path" });
    },
    onError(error) {
      handleError(
        error,
        { forAllStates: "something went wrong while updating product info" },
        5000
      );
    },
  });

  // react-hook-form
  const form = useForm<ProductFormValues>();
  const { handleSubmit, register, formState, reset, setValue } = form;
  const { errors } = formState;
  const {
    color: clrErr,
    price: priceErr,
    quantity: qtyErr,
    title: titleErr,
    description: disErr,
  } = errors;

  const onSubmit: SubmitHandler<ProductFormValues> = (data, e) => {
    e?.preventDefault();

    if (
      !imgsList.current?.imgsList.length &&
      !imgsList.current?.initImgs.length
    ) {
      return setImgErr("product must have at least one image");
    }

    if (!selectedBrand || !selectedCategory) {
      return showMsg?.({
        clr: "red",
        content: `please select a ${
          !selectedBrand ? "brand" : "category"
        } for this product`,
      });
    }

    const productData = {
      ...data,
      category: selectedCategory,
      brand: selectedBrand,
      imgs: imgsList.current?.imgsList.map((img) => img.img),
    };

    if (isEditMode) {
      if (!id) {
        return showMsg?.({
          clr: "red",
          content: "product id not found",
        });
      }

      if (product) {
        Object.entries(product).forEach(([oldKey, oldValue]) => {
          if (oldKey === "ratings") {
            delete productData[oldKey as keyof typeof productData];

            return;
          }

          if (oldKey === "imgs") {
            if (!productData.imgs.length) {
              delete productData[oldKey as keyof typeof productData];
            }

            return;
          }

          const newValue = productData[oldKey as keyof typeof productData];

          const finalOldValue = ["category", "brand"].includes(oldKey)
            ? (oldValue as ProductType["brand" | "category"])._id
            : oldValue;

          if (newValue === finalOldValue) {
            delete productData[oldKey as keyof typeof productData];
          }
        });

        editProductMutate({ productData, productId: id });
      } else
        showMsg?.({
          clr: "red",
          content: "something went wrong while updating product info",
        });
    } else {
      addProductMutate({
        productData,
      });
    }
  };

  useEffect(() => {
    if (!product && id) getResProduct();

    if (appProduct && id) {
      Object.entries(appProduct!).forEach(([key, val]) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue(key as keyof requestProductType, val as any)
      );

      if (appProduct?.brand._id) setSelectedBrand(appProduct?.brand._id);
      if (appProduct?.category._id)
        setSelectedCategory(appProduct?.category._id);

      imgsList.current?.setInitImgs(appProduct.imgs);
    }

    if (!appCategories || !appCategories.length) getCategories();
    if (!appBrands || !appBrands.length) getBrands();

    if (isEditMode) {
      // if the page is edit product => fill in form inputs with product data
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

          imgsList.current?.setInitImgs(product.imgs);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (resProduct) {
      setProduct(resProduct);
      Object.entries(resProduct).forEach(([key, val]) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue(key as keyof requestProductType, val as any)
      );
      setSelectedBrand(resProduct.brand._id);
      setSelectedCategory(resProduct.category._id);

      imgsList.current?.setInitImgs(resProduct.imgs);
    }
  }, [resProduct]);

  useEffect(() => {
    if (resBrands) {
      dispatch(
        setCategoriesOrBrand({ type: "brands", categoriesOrBrands: resBrands })
      );
    }
  }, [resBrands]);

  useEffect(() => {
    if (resCategories) {
      dispatch(
        setCategoriesOrBrand({
          type: "categories",
          categoriesOrBrands: resCategories,
        })
      );
    }
  }, [resCategories]);

  if (
    isEditMode &&
    resProductLoading &&
    resProductFetchStatus !== "idle" &&
    isFirestRender.current
  ) {
    isFirestRender.current = false;
    return <SplashScreen children="Loading The Product..." />;
  }

  if (resBrandsLoading || resCategoriesLoading) {
    return <Spinner fullWidth>Loading...</Spinner>;
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

  if (resCategoriesErr || resBrandsErr) {
    return (
      <DisplayError
        error={resCategoriesErrData || resBrandsErrData}
        initMsg="something went wrong, try again later"
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

        <div>
          <span className="select-list-label">category :</span>
          <SelectList
            ref={categoriesListRef}
            label="choose category"
            disabled={{
              value: productLoading,
              text: "Loading...",
            }}
            listOptsArr={appCategories.map((cat) => {
              return {
                selected: cat._id === selectedCategory,
                text: cat.name,
              };
            })}
            optClickFunc={(e) => {
              const categoryId = appCategories.find(
                (cat) => cat.name === e.currentTarget.dataset.opt
              )?._id;

              if (categoryId) setSelectedCategory(categoryId);
            }}
          />
        </div>

        <div>
          <span className="select-list-label">brand :</span>
          <SelectList
            ref={brandsListRef}
            label="choose brand"
            disabled={{
              value: productLoading,
              text: "Loading...",
            }}
            listOptsArr={appBrands.map((brand) => ({
              selected: brand._id === selectedBrand,
              text: brand.name,
            }))}
            optClickFunc={(e) => {
              const brandId = appBrands.find(
                (brand) => brand.name === e.currentTarget.dataset.opt
              )?._id;

              if (brandId) setSelectedBrand(brandId);
            }}
          />
        </div>

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
          imgErr={imgErr}
          product={product}
          setProduct={setProduct}
        />

        <button
          title={isEditMode ? "save new changes" : "add product"}
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
    </AnimatedLayout>
  );
};
export default NewProductPage;
