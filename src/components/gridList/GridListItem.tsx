import { type ReactNode } from "react";

type Props = {
  cells: (keyof Props["itemData"] | string)[];
  itemData: Record<string, ReactNode>;
};

const GridListItem = ({ cells, itemData }: Props) => {
  return (
    <li>
      {cells.map((cell) => {
        return (
          <p key={cell.toString()} className="grid-list-item-content">
            <strong className="cell-prop-name">{cell.toString()}: </strong>
            <span>{cell in itemData ? itemData[cell] : "--"}</span>
          </p>
        );
      })}
    </li>
  );
};

export default GridListItem;
