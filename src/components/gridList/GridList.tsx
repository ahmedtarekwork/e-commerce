// react
import { CSSProperties, ComponentProps, ReactNode, useState } from "react";

// components
import FillIcon from "../FillIcon";

// icons
import { TfiLayoutGrid3, TfiLayoutGrid3Alt } from "react-icons/tfi";
import { PiRowsBold, PiRowsFill } from "react-icons/pi";

// utiles
import { nanoid } from "@reduxjs/toolkit";

type ListType = "row" | "column";

type Props = {
  children: ReactNode;
  cells: string[];
  initType: ListType;
  isChanging?: boolean;
  withMargin?: boolean;
};

const GridList = ({
  children,
  cells,
  initType,
  isChanging = true,
  withMargin,
}: Props) => {
  const [type, setType] = useState<ListType>(initType);

  const attr = {} as ComponentProps<"ul">;
  if (type === "row")
    attr.style = {
      "--list-item-cell-width": 100 / cells.length + "%",
      "--cells-length": cells.length,
    } as CSSProperties;

  return (
    <>
      {isChanging && (
        <div className="grid-list-switcher-btns">
          <button
            onClick={() => setType("column")}
            className={`btn ${type === "column" ? "active" : ""}`}
          >
            <FillIcon
              stroke={<TfiLayoutGrid3 />}
              fill={<TfiLayoutGrid3Alt />}
            />
          </button>

          <button
            onClick={() => setType("row")}
            className={`btn ${type === "row" ? "active" : ""}`}
          >
            <FillIcon stroke={<PiRowsBold />} fill={<PiRowsFill />} />
          </button>
        </div>
      )}

      <ul
        className={`${type}s-list grid-list${withMargin ? " with-margin" : ""}`}
        {...attr}
      >
        {type !== "column" && (
          <li className="rows-list-header">
            {cells.map((cell) => (
              <p className="white-selection" key={nanoid()}>
                {cell}
              </p>
            ))}
          </li>
        )}

        {children}
      </ul>
    </>
  );
};
export default GridList;
