import type { ComponentProps, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  name: string;
  val: ReactNode;
  propNameProps?: ComponentProps<"span">;
  valueAsLink?: {
    path: string;
    data: unknown;
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
      className={
        (valueAsLink ? "flex-cell-prop-name" : "") +
        (className ? ` ${className}` : "")
      }
    >
      <strong className="cell-prop-name">{name}: </strong>
      {valueAsLink ? (
        <button
          className="hov link"
          onClick={() =>
            navigate(valueAsLink.path, {
              relative: "path",
            })
          }
        >
          <span {...propNameProps}>{val}</span>
        </button>
      ) : (
        <span {...propNameProps}>{val}</span>
      )}
    </div>
  );
};
export default PropCell;
