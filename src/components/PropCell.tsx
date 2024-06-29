import type { ComponentProps, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  name: string;
  val: ReactNode;
  propNameProps?: ComponentProps<"div">;
  valueAsLink?: {
    path: string;
  };
} & ComponentProps<"p">;

const PropCell = ({
  name,
  val,
  propNameProps,
  valueAsLink,
  className,
  ...attr
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      {...attr}
      className={"prop-cell-holder" + (className ? ` ${className}` : "")}
    >
      <strong className="prop-cell-name">{name}: </strong>
      {valueAsLink ? (
        <button
          title="property cell btn"
          className="hov link"
          onClick={() =>
            navigate(valueAsLink.path, {
              relative: "path",
            })
          }
        >
          <div className="prop-cell-value" {...propNameProps}>
            {val}
          </div>
        </button>
      ) : (
        <div className="prop-cell-value" {...propNameProps}>
          {val}
        </div>
      )}
    </div>
  );
};
export default PropCell;
