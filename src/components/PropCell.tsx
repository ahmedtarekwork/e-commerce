import { Fragment, type ComponentProps, type ReactNode } from "react";
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

  const ValueHolderTagName = valueAsLink
    ? {
        tagName: "button",
        props: {
          title: "property cell btn",
          className: "hov link prop-cell-value-as-btn",
          onClick: () => {
            navigate(valueAsLink.path, {
              relative: "path",
            });
          },
        } as ComponentProps<"button">,
      }
    : { tagName: Fragment, props: {} };

  return (
    <div
      {...attr}
      className={"prop-cell-holder" + (className ? ` ${className}` : "")}
    >
      <strong className="prop-cell-name">{name}: </strong>
      <ValueHolderTagName.tagName {...ValueHolderTagName.props}>
        <div className="prop-cell-value" {...propNameProps}>
          {val}
        </div>
      </ValueHolderTagName.tagName>

      {/* {valueAsLink ? (
        <button
          style={{ flex: 1, color: "#052d60" }}
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
      )} */}
    </div>
  );
};
export default PropCell;
