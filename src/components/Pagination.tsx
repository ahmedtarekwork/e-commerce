import {
  memo,
  useRef,
  type ComponentProps,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { nanoid } from "@reduxjs/toolkit";

type Props = {
  onClickFn?: (e: MouseEvent<HTMLButtonElement>) => void;
  pagesCount: number | undefined;
  activePage: number;
  setActivePage: Dispatch<SetStateAction<number>>;
} & ComponentProps<"ul">;

const Pagination = memo(
  ({ pagesCount, onClickFn, activePage, setActivePage, ...attr }: Props) => {
    const count = useRef(pagesCount);

    return (
      <ul
        {...attr}
        className={`pagination-holder${
          attr.className ? ` ${attr.className}` : ""
        }`}
      >
        {Array.from({ length: pagesCount || count.current || 1 }).map(
          (_, i) => (
            <li key={nanoid()}>
              <button
                title="pagination btn"
                className={activePage === i + 1 ? "active" : ""}
                onClick={(e) => {
                  setActivePage(i + 1);
                  onClickFn?.(e);
                }}
              >
                {i + 1}
              </button>
            </li>
          )
        )}
      </ul>
    );
  }
);
export default Pagination;
