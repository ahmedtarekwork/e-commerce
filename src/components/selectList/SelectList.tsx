import {
  useState,
  useRef,

  // types
  type MouseEvent,
} from "react";

// components
import ListWrapper, {
  type ListWrapperRefType,
  type ListWrapperComponentsProps,
} from "../ListWrapper";

// utiles
import { nanoid } from "@reduxjs/toolkit";

export type selectListOptionType<T extends string = string> = {
  selected: boolean;
  text: T;
};

export type SelectListComponentProps = {
  listOptsArr: selectListOptionType[];
  optClickFunc: (e: MouseEvent<HTMLButtonElement>) => void;
  label?: string;
} & Pick<ListWrapperComponentsProps, "disabled" | "closeOptions" | "outOfFlow">;

const SelectList = ({
  listOptsArr,
  label,
  optClickFunc,
  disabled,
  outOfFlow,
}: SelectListComponentProps) => {
  // states
  const [list, setList] = useState(listOptsArr);

  // refs
  const listWrapperRef = useRef<ListWrapperRefType>(null);

  return (
    <ListWrapper
      ref={listWrapperRef}
      outOfFlow={outOfFlow}
      disabled={disabled}
      btnData={{
        children: (
          <p className="select-list-selected-opt">
            {(disabled?.value ? disabled.text : "") ||
              list.find((o) => o.selected)?.text ||
              label}
          </p>
        ),
      }}
    >
      <ul className="select-list">
        {list.map((opt) => (
          <li className="select-list-opt" key={nanoid()}>
            <button
              title="select list option"
              data-selected={opt.selected}
              data-opt={opt.text} // it's necessary to can access it when calling the component and set the "optClickFunc"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                optClickFunc?.(e);

                listWrapperRef.current?.setToggleList(false);

                setList((prev) =>
                  prev.map((o) =>
                    o.text === opt.text
                      ? { ...o, selected: true }
                      : { ...o, selected: false }
                  )
                );
              }}
              type="button"
            >
              {opt.text}
            </button>
          </li>
        ))}
      </ul>
    </ListWrapper>
  );
};

export default SelectList;
