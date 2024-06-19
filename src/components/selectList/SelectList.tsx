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

  // Refs
  // const toggleListBtnRef = useRef<HTMLButtonElement>(null);
  // const theListRef = useRef<HTMLUListElement>(null);

  // useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const clickFunc = (e: any) =>
  //     setToggleList(toggleListBtnRef.current?.isEqualNode(e.target) || false);

  //   const keyDownFunc = (e: KeyboardEvent) => setToggleList(e.key === "Escape");

  //   // closeing selectList
  //   window.addEventListener("click", clickFunc);
  //   window.addEventListener("keydown", keyDownFunc);

  //   const list = theListRef.current;
  //   const btn = toggleListBtnRef.current;

  //   if (outOfFlow?.value && !outOfFlow.fullWidth) {
  //     if (list && btn) {
  //       const btnStyles = getComputedStyle(btn);
  //       const additionWidth = [
  //         btnStyles.gap,
  //         btnStyles.paddingLeft,
  //         btnStyles.paddingRight,
  //       ]
  //         .map((style) => +style.replace("px", ""))
  //         .reduce((a, c) => a + c);

  //       [btn, list].forEach(
  //         (el) => (el.style.width = `${list.offsetWidth + additionWidth}px`)
  //       );
  //     }
  //   }

  //   return () => {
  //     window.removeEventListener("click", clickFunc);
  //     window.removeEventListener("keydown", keyDownFunc);

  //     if (outOfFlow && list && btn) {
  //       [btn, list].forEach((el) => el.style.removeProperty("width"));
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const theListEl = theListRef.current;
  //   const listHolder = theListEl?.parentElement;

  //   if (listHolder) {
  //     const timeToOpen =
  //       parseFloat(getComputedStyle(listHolder).transitionDuration) * 1000;

  //     if (toggleList) {
  //       listHolder.style.height = `${theListEl.offsetHeight}px`;

  //       setTimeout(() => (listHolder.style.overflowY = "auto"), timeToOpen);
  //     } else {
  //       listHolder.style.removeProperty("height");
  //       listHolder.style.removeProperty("overflow-y");
  //     }
  //   }
  // }, [toggleList]);

  // let additionalClssNames = outOfFlow?.value ? " out-of-flow" : "";
  // if (outOfFlow?.value && !outOfFlow.fullWidth) {
  //   additionalClssNames += " custom-width";
  // }

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

    // <div
    //   className={`select-list${additionalClssNames}${
    //     toggleList ? " active" : ""
    //   }`}
    // >
    //   <button
    //     title="select list open btn"
    //     disabled={disabled?.value}
    //     type="button"
    //     className={`select-list-summary${disabled?.value ? " disabled" : ""}`}
    //     onClick={() => setToggleList(!toggleList)}
    //     ref={toggleListBtnRef}
    //   >
    //     <p className="select-list-selected-opt">
    //       {(disabled?.value ? disabled.text : "") ||
    //         list.find((o) => o.selected)?.text ||
    //         label}
    //     </p>
    //     <Arrow active={toggleList} />
    //   </button>

    //   <div
    //     className="select-list-list-holder"
    //     style={
    //       {
    //         "--max-height": `calc(100vh - (${
    //           theListRef.current?.parentElement?.getBoundingClientRect().top ||
    //           0
    //         }px + 10px))`,
    //       } as CSSProperties
    //     }
    //   >
    //     <ul
    //       className="select-list-list"
    //       ref={theListRef}
    //       style={{
    //         overflow: "hidden",
    //       }}
    //     >
    //       {list.map((opt) => (
    //         <li className="select-list-opt" key={nanoid()}>
    //           <button
    //             title="select list option"
    //             data-selected={opt.selected}
    //             data-opt={opt.text} // it's necessary to can access it when calling the component and set the "optClickFunc"
    //             onClick={(e: MouseEvent<HTMLButtonElement>) => {
    //               optClickFunc?.(e);
    //               setToggleList(false);
    //               setList((prev) =>
    //                 prev.map((o) =>
    //                   o.text === opt.text
    //                     ? { ...o, selected: true }
    //                     : { ...o, selected: false }
    //                 )
    //               );
    //             }}
    //             type="button"
    //           >
    //             {opt.text}
    //           </button>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  );
};

export default SelectList;
