import type { CSSProperties, ComponentProps } from "react";

type Props = {
  stroke: JSX.Element;
  fill: JSX.Element;
  diminsions?: number;
} & ComponentProps<"div">;

const FillIcon = ({ stroke, fill, diminsions = 18, ...attr }: Props) => {
  return (
    <div
      {...attr}
      className={`fill-icon${attr.className ? ` ${attr.className}` : ""}`}
      style={
        { "--diminsions": diminsions + "px", ...attr.style } as CSSProperties
      }
    >
      <div className="stroke">{stroke}</div>
      <div className="fill">{fill}</div>
    </div>
  );
};
export default FillIcon;
