import { CSSProperties } from "react";

interface props {
  stroke: JSX.Element;
  fill: JSX.Element;
  diminsions?: number;
}

const FillIcon = ({ stroke, fill, diminsions = 18 }: props) => {
  return (
    <div
      className="fill-icon"
      style={{ "--diminsions": diminsions + "px" } as CSSProperties}
    >
      <div className="stroke">{stroke}</div>
      <div className="fill">{fill}</div>
    </div>
  );
};
export default FillIcon;
