// react
import { useState } from "react";

// react router dom
import { Link, useParams } from "react-router-dom";

// components
import FillIcon from "../../../../components/FillIcon";
import SingleProductPageDeleteBtn from "./SingleProductPageDeleteBtn";

// icons
import { RiBallPenFill, RiBallPenLine } from "react-icons/ri";

// types
import type { ProductType } from "../../../../utils/types";

type Props = Pick<ProductType, "title">;

const SingleProductPageDashboardBtns = ({ title }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  return (
    <>
      <SingleProductPageDeleteBtn
        productId={id!}
        productTitle={title}
        setIsLoading={setIsLoading}
      />

      <Link
        title="go to edit product page"
        to={`/dashboard/edit-product/${id}`}
        relative="path"
        className="btn"
        data-disabled={isLoading}
      >
        <FillIcon
          diminsions={20}
          stroke={<RiBallPenLine />}
          fill={<RiBallPenFill />}
        />
        edit
      </Link>
    </>
  );
};
export default SingleProductPageDashboardBtns;
