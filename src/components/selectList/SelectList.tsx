import {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,

  // types
  type MouseEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  memo,
} from "react";

// components
import ListWrapper, {
  type ListWrapperRefType,
  type ListWrapperComponentsProps,
} from "../ListWrapper";

// utils
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

export type SelectListComponentRefType = {
  setList: Dispatch<SetStateAction<selectListOptionType<string>[]>>;
};

const SelectList = memo(
  forwardRef<SelectListComponentRefType, SelectListComponentProps>(
    ({ listOptsArr, label, optClickFunc, disabled, outOfFlow }, ref) => {
      // states
      const [list, setList] = useState(listOptsArr);

      // refs
      const listWrapperRef = useRef<ListWrapperRefType>(null);

      useImperativeHandle(ref, () => ({ setList }), []);

      useEffect(() => {
        setList(listOptsArr);
      }, [listOptsArr]);

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
    }
  )
);

export default SelectList;
