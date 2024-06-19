import {
  memo,
  useRef,

  // types
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

    const finalPagesCount = pagesCount || count.current;

    return (
      <ul
        {...attr}
        className={`pagination-holder${
          attr.className ? ` ${attr.className}` : ""
        }`}
      >
        {finalPagesCount
          ? Array.from({ length: finalPagesCount }).map((_, i) => (
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
            ))
          : null}
      </ul>
    );
  }
);
export default Pagination;
