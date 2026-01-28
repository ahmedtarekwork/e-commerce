// react
import { useRef } from "react";

// react router dom
import { Link, useNavigate } from "react-router-dom";

// react query
import {
  type QueryObserverResult,
  type RefetchOptions,
} from "@tanstack/react-query";

// components
import RemoveCatOrBrandSureModel from "./RemoveCatOrBrandSureModel";

// framer motion
import { motion, type HTMLMotionProps } from "framer-motion";

// types
import type { CategoryAndBrandType } from "../../utils/types";
import type { SureModalRef } from "../modals/AreYouSureModal";

type Props = {
  isDashboard: boolean;
  type: "categories" | "brands";
  modelData: CategoryAndBrandType;
  refetchModels: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<CategoryAndBrandType[]>>;
};

const CategoryAndBrandCard = ({
  isDashboard,
  type,
  modelData,
  refetchModels,
}: Props) => {
  const sureModelRef = useRef<SureModalRef>(null);

  const navigate = useNavigate();

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

  return (
    <>
      <RemoveCatOrBrandSureModel
        _id={_id}
        name={name}
        singleType={singleType}
        type={type}
        refetchModels={refetchModels}
        ref={sureModelRef}
      />

      <ComponentData.tagName {...ComponentData.data} key={_id}>
        <button
          data-testid={`main-btn-for-${singleType}-${_id}`}
          className="category-or-brand-card"
          title={`go to ${name} category`}
          onClick={(e) => {
            if (
              ["btn", "red-btn"].every(
                (name) => !(e.target as HTMLElement).classList.contains(name)
              )
            ) {
              navigate(
                `${
                  isDashboard ? "/dashboard" : ""
                }/products?${singleType}=${name}`,
                {
                  relative: "path",
                }
              );
            }
          }}
        >
          <img
            src={image.secure_url}
            alt={`${name} ${singleType} image`}
            width={150}
            height={120}
            data-testid={`img-for-${singleType}-${_id}`}
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
