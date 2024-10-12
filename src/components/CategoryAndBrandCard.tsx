// react
import { useRef } from "react";

// react router dom
import { Link, useNavigate } from "react-router-dom";

// react query
import {
  useMutation,

  // types
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";

// components
import AreYouSureModal, { type SureModalRef } from "./modals/AreYouSureModal";

// framer motion
import { type HTMLMotionProps, motion } from "framer-motion";

// types
import type { CategoryAndBrandType } from "../utils/types";

// hooks
import useHandleErrorMsg from "../hooks/useHandleErrorMsg";
import useShowMsg from "../hooks/useShowMsg";

// utils
import axios from "../utils/axios";

type Props = {
  isDashboard: boolean;
  type: "categories" | "brands";
  modelData: CategoryAndBrandType;
  refetchModels: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<CategoryAndBrandType[]>>;
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

const CategoryAndBrandCard = ({
  isDashboard,
  type,
  modelData,
  refetchModels,
}: Props) => {
  const navigate = useNavigate();

  // hooks
  const handleError = useHandleErrorMsg();
  const showMsg = useShowMsg();

  // refs
  const sureModelRef = useRef<SureModalRef>(null);

  const singleType = type === "brands" ? "brand" : "category";

  const { _id, image, name } = modelData;

  const ComponentData = isDashboard
    ? {
        tagName: motion.li,
        data: {
          layout: true,
          initial: { scale: 0 },
          animate: { scale: 1 },
          exit: { scale: 0 },
        } as HTMLMotionProps<"li">,
      }
    : {
        tagName: "li",
        data: {},
      };

  const { isPending: removeLoading, mutate: removeModelMutate } = useMutation({
    mutationKey: [`remove ${singleType}`],
    mutationFn: deleteCategoryOrBrandMutationFn,
    onSuccess: (data) => {
      showMsg?.({
        content: data.message || `${singleType} deleted successfully`,
        clr: "green",
        time: 4000,
      });
      sureModelRef.current?.setOpenModal(false);
      sureModelRef.current?.setShowYesSpinner(false);

      refetchModels();
    },
    onError: (data) => {
      handleError(data);

      sureModelRef.current?.setShowYesSpinner(false);
      sureModelRef.current?.appModalEl
        ?.querySelectorAll("button")
        .forEach((btn) => (btn.disabled = false));
    },
  });

  return (
    <>
      <AreYouSureModal
        ref={sureModelRef}
        functionToMake={(e) => {
          sureModelRef.current?.appModalEl
            ?.querySelectorAll("button")
            .forEach((btn) => (btn.disabled = true));

          e.currentTarget.disabled = true;
          sureModelRef.current?.setShowYesSpinner(true);
          removeModelMutate({ type, id: _id });
        }}
        toggleClosingFunctions={!removeLoading}
      >
        Are you sure you want to delete{" "}
        <span style={{ color: "var(--danger)", fontWeight: "bold" }}>
          {name}
        </span>{" "}
        {singleType}
      </AreYouSureModal>

      <ComponentData.tagName {...ComponentData.data} key={_id}>
        <button
          className="category-or-brand-card"
          title={`go to ${name} category`}
          onClick={(e) => {
            if (
              ["btn", "red-btn"].every(
                (name) => !(e.target as HTMLElement).classList.contains(name)
              )
            ) {
              navigate(`/products?${singleType}=${name}`, {
                relative: "path",
              });
            }
          }}
        >
          <img
            src={image.secure_url}
            alt={`${name} ${singleType} image`}
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
                    sureModelRef.current?.setOpenModal(true);
                  }}
                >
                  delete
                </span>
                <Link className="btn" to={`/dashboard/${type}Form?id=${_id}`}>
                  edit
                </Link>
              </div>
            )}
          </div>
        </button>
      </ComponentData.tagName>
    </>
  );
};
export default CategoryAndBrandCard;
