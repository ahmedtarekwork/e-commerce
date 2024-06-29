// react
import { type ReactNode } from "react";

// components
import PropCell from "../PropCell";

type Props = {
  cells: (keyof Props["itemData"] | string)[];
  itemData: Record<string, ReactNode>;
};

const GridListItem = ({ cells, itemData }: Props) => {
  return (
    <li>
      {cells.map((cell) => {
        return (
          <PropCell
            key={cell.toString()}
            name={cell.toString()}
            val={cell in itemData ? itemData[cell] : "--"}
          />
        );
      })}
    </li>
  );
};

export default GridListItem;
