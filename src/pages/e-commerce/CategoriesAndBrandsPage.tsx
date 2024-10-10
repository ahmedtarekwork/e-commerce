// react
import { useEffect, useRef, useState } from "react";

// react router
import { Link, useNavigate, useLocation } from "react-router-dom";

// react query
import { useMutation, useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
import useSelector from "../../hooks/redux/useSelector";
// redux actions
import {
  removeCategoryOrBrand,
  setCategoriesOrBrand,
} from "../../store/fetures/categoriesAndBrandsSlice";

// components
import Spinner from "../../components/spinners/Spinner";
import DisplayError from "../../components/layout/DisplayError";
import Heading from "../../components/Heading";

import AreYouSureModal, {
  type SureModalRef,
} from "../../components/modals/AreYouSureModal";

// utils
import axios from "axios";

// types
import type { CategoryAndBrandType } from "../../utils/types";

// framer motion
import { motion } from "framer-motion";

// hooks
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";
import useShowMsg from "../../hooks/useShowMsg";

type Props = {
  type: "categories" | "brands";
};

// fetchers
const getCategoriesOrBrandsQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, type],
}: {
  queryKey: string[];
}): Promise<CategoryAndBrandType[]> => {
  return (await axios(type)).data;
};

const deleteCategoryOrBrandMutationFn = async ({
  type,
  id,
}: {
  type: Props["type"];
  id: string;
}) => {
  return (await axios.delete(`${type}/${id}`)).data;
};

const CategoriesAndBrandsPage = ({ type }: Props) => {
  // redux
  const dispatch = useDispatch();
  const modelArr = useSelector((state) => state.categoriesAndBrands)[type];
  const showMsg = useShowMsg();

  // hooks
  const handleError = useHandleErrorMsg();

  // react router
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // constants
  const isDashboard = pathname.includes("dashboard");
  const signleType = type === "brands" ? "brand" : "category";

  // refs
  const sureModelRef = useRef<SureModalRef>(null);
  const isFirstSet = useRef(false);

  // states
  const [selectedModel, setSelectedModel] = useState<Record<
    "id" | "name",
    string
  > | null>(null);

  const { data, isError, error, isPending } = useQuery({
    queryKey: [`get ${type}`, type],
    queryFn: getCategoriesOrBrandsQueryFn,
  });

  const { isPending: removeLoading, mutate: removeModelMutate } = useMutation({
    mutationKey: [`remove ${signleType}`],
    mutationFn: deleteCategoryOrBrandMutationFn,
    onSuccess: (data) => {
      showMsg?.({
        content: data.message || `${signleType} deleted successfully`,
        clr: "green",
        time: 4000,
      });
      sureModelRef.current?.toggleModal(false);
      sureModelRef.current?.setShowYesSpinner(false);

      if (selectedModel) {
        dispatch(removeCategoryOrBrand({ type, id: selectedModel.id }));
      }
    },
    onError: (data) => {
      handleError(data);

      sureModelRef.current?.setShowYesSpinner(false);
      sureModelRef.current?.appModalEl
        ?.querySelectorAll("button")
        .forEach((btn) => (btn.disabled = false));
    },
  });

  useEffect(() => {
    if (!modelArr.length && data?.length && !isFirstSet.current) {
      dispatch(setCategoriesOrBrand({ type, categoriesOrBrands: data }));
      isFirstSet.current = true;
    }
  }, [data, modelArr]);

  if (isPending) {
    return <Spinner fullWidth>Loading {type}...</Spinner>;
  }

  if (isError) {
    return (
      <DisplayError
        error={error}
        initMsg={`somthing went wrong while display ${type}`}
      />
    );
  }

  return (
    <div
      style={
        !modelArr.length
          ? { display: "grid", placeContent: "center", height: "100%" }
          : {}
      }
    >
      {!!modelArr.length && (
        <>
          {isDashboard && (
            <Link
              className="btn"
              to={`/dashboard/${type}Form`}
              relative="path"
              style={{ marginBottom: 30 }}
            >
              + Add New {type}
            </Link>
          )}

          <Heading>Available {type}</Heading>

          <ul className="categories-or-brands-list">
            {modelArr.map(({ _id, image, name }) => (
              <motion.li key={_id} layout>
                <button
                  className="category-or-brand-card"
                  title={`go to ${name} category`}
                  onClick={(e) => {
                    if (
                      ["btn", "red-btn"].every(
                        (name) =>
                          !(e.target as HTMLElement).classList.contains(name)
                      )
                    ) {
                      navigate(`/products?${signleType}=${name}`, {
                        relative: "path",
                      });
                    }
                  }}
                >
                  <img
                    src={image.secure_url}
                    alt={`${name} ${
                      type === "brands" ? "brand" : "category"
                    } image`}
                    width={150}
                    height={120}
                  />

                  <div style={{ width: "100%" }}>
                    <p>{name}</p>

                    {isDashboard && (
                      <div className="category-and-brand-card-btns-holder">
                        <span
                          className="red-btn"
                          onClick={() => {
                            sureModelRef.current?.toggleModal(true);
                            setSelectedModel({ id: _id, name });
                          }}
                        >
                          delete
                        </span>
                        <Link
                          className="btn"
                          to={`/dashboard/${type}Form?id=${_id}`}
                        >
                          edit
                        </Link>
                      </div>
                    )}
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>

          <AreYouSureModal
            ref={sureModelRef}
            functionToMake={(e) => {
              if (selectedModel) {
                sureModelRef.current?.appModalEl
                  ?.querySelectorAll("button")
                  .forEach((btn) => (btn.disabled = true));

                e.currentTarget.disabled = true;
                sureModelRef.current?.setShowYesSpinner(true);
                removeModelMutate({ type, id: selectedModel.id });
              }
            }}
            toggleClosingFunctions={!removeLoading}
          >
            Are you sure you want to delete{" "}
            <span style={{ color: "var(--danger)", fontWeight: "bold" }}>
              {selectedModel?.name}
            </span>{" "}
            {signleType}
          </AreYouSureModal>
        </>
      )}

      {!modelArr.length && (
        <div className="category-or-brand-no-data-holder">
          <strong>there aren't any {type} to display</strong>
          <Link className="btn" to={`/dashboard/${type}Form`} relative="path">
            + Add Some {type}
          </Link>
        </div>
      )}
    </div>
  );
};
export default CategoriesAndBrandsPage;
