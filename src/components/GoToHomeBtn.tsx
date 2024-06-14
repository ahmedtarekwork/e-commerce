// react
import type { ComponentProps } from "react";

// react router dom
import { Link } from "react-router-dom";

// icons
import { MdHome } from "react-icons/md";

const GoToHomeBtn = ({ ...attr }: ComponentProps<"a">) => {
  return (
    <Link
      title="go to home btn"
      to="/"
      relative="path"
      {...attr}
      className={`btn go-to-home-btn${
        attr.className ? ` ${attr.className}` : ""
      }`}
    >
      <MdHome style={{ fontSize: 20 }} /> Go to home
    </Link>
  );
};
export default GoToHomeBtn;
