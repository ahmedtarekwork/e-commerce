// react
import type { ComponentProps } from "react";

// react router dom
import { Link } from "react-router-dom";

// icons
import { MdNewReleases } from "react-icons/md";

const GoToMakeNewProductsBtn = ({ ...attr }: ComponentProps<"a">) => {
  return (
    <Link
      title="make a new product btn"
      to="/dashboard/new-product"
      relative="path"
      {...attr}
      style={{
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        ...attr.style,
      }}
      className={`btn${attr.className ? ` ${attr.className}` : ""}`}
    >
      <MdNewReleases />
      make a new product
    </Link>
  );
};
export default GoToMakeNewProductsBtn;
