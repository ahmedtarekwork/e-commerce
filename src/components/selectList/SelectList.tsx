import { useState, useEffect, useRef, MouseEvent } from "react";

// components
import Arrow from "./Arrow";

// utiles
import { nanoid } from "@reduxjs/toolkit";

export type selectListOptionType<T extends string = string> = {
  selected: boolean;
  text: T;
};
type props = {
  disabled?: {
    value: boolean;
    text?: string;
  };
  listOptsArr: selectListOptionType[];
  optClickFunc: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
  id: string;
  outOfFlow?: boolean;
};

const SelectList = ({
  listOptsArr,
  label,
  id,
  optClickFunc,
  disabled,
  outOfFlow,
}: props) => {
  // Refs
  const theList = useRef<HTMLUListElement>(null);
  const toggleListBtn = useRef<HTMLButtonElement>(null);

  // useStates
  const [toggleList, setToggleList] = useState(false);
  const [list, setList] = useState(listOptsArr);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clickFunc = (e: any) =>
      e.target !== toggleListBtn.current && setToggleList(false);

    const keyDownFunc = (e: KeyboardEvent) =>
      e.key === "Escape" && setToggleList(false);

    // closeing selectList
    window.addEventListener("click", clickFunc);
    window.addEventListener("keydown", keyDownFunc);

    return () => {
      window.removeEventListener("click", clickFunc);
      window.removeEventListener("keydown", keyDownFunc);
    };
  }, []);

  useEffect(() => {
    const theListEl = theList.current;

    if (theListEl?.parentElement) {
      if (toggleList)
        theListEl.parentElement.style.height = `${theListEl.offsetHeight}px`;
      else theListEl.parentElement.style.removeProperty("height");
    }
  }, [toggleList]);

  return (
    <div className={`select-list-holder${outOfFlow ? " out-of-flow" : ""}`}>
      <div id={id} className={`select-list ${toggleList ? "active" : ""}`}>
        <button
          disabled={disabled?.value}
          type="button"
          className={`select-list-summary${disabled?.value ? " disabled" : ""}`}
          onClick={() => setToggleList(!toggleList)}
          ref={toggleListBtn}
        >
          <p className="select-list-selected-opt">
            {(disabled?.value ? disabled.text : "") ||
              list.find((o) => o.selected)?.text ||
              label}
          </p>
          <Arrow active={toggleList} />
        </button>

        <div className="select-list-list-holder">
          <ul className="select-list-list" ref={theList}>
            {list.map((opt) => (
              <li className="select-list-opt" key={nanoid()}>
                <button
                  data-selected={opt.selected}
                  data-opt={opt.text} // it's neccessary to can access it when calling the component and set the "optClickFunc"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    optClickFunc?.(e);
                    setToggleList(false);
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
        </div>
      </div>
    </div>
  );
};

export default SelectList;
