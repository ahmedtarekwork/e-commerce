// react
import {
  useState,

  // types
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";

// components
import FillIcon from "../FillIcon";
import GridListSearch, { type GridListSearchProps } from "./GridListSearch";

// icons
import { TfiLayoutGrid3, TfiLayoutGrid3Alt } from "react-icons/tfi";
import { PiRowsBold, PiRowsFill } from "react-icons/pi";

// utils
import { nanoid } from "@reduxjs/toolkit";

type ListType = "row" | "column";

type Props = {
  children: ReactNode;
  cells: string[];
  initType: ListType;
  isChanging?: boolean;
  withMargin?: boolean;
  withSearch?: GridListSearchProps;
} & ComponentProps<"ul">;

const GridList = ({
  children,
  cells,
  initType,
  isChanging = true,
  withMargin,
  withSearch,
  ...attr
}: Props) => {
  const [type, setType] = useState<ListType>(initType);

  if (type === "row")
    attr.style = {
      "--list-item-cell-width": 100 / cells.length + "%",
      "--cells-length": cells.length,
    } as CSSProperties;

  return (
    <>
      {(isChanging || withSearch) && (
        <div className="grid-list-extensions-holder">
          {withSearch && <GridListSearch {...withSearch} />}

          {isChanging && (
            <div className="grid-list-switcher-btns">
              <button
                title="switch list to columns type btn"
                onClick={() => setType("column")}
                className={`btn ${type === "column" ? "active" : ""}`}
              >
                <FillIcon
                  stroke={<TfiLayoutGrid3 />}
                  fill={<TfiLayoutGrid3Alt />}
                />
              </button>

              <button
                title="switch list to rows type btn"
                onClick={() => setType("row")}
                className={`btn ${type === "row" ? "active" : ""}`}
              >
                <FillIcon stroke={<PiRowsBold />} fill={<PiRowsFill />} />
              </button>
            </div>
          )}
        </div>
      )}

      <ul
        {...attr}
        className={`${type}s-list grid-list${withMargin ? " with-margin" : ""}${
          attr.className ? ` ${attr.className}` : ""
        }`}
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
