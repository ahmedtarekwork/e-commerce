// react
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,

  // types
  type ReactNode,
  type ComponentProps,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";

// components
import Arrow from "./selectList/Arrow";

type Props = {
  children: ReactNode;
  btnData: {
    children: ReactNode;
  } & ComponentProps<"button">;

  disabled?: {
    value: boolean;
    text?: string;
  };
  outOfFlow?:
    | {
        value: true;
        fullWidth: boolean;
      }
    | {
        value: false;
        fullWidth?: never;
      };
} & ComponentProps<"div">;

export type ListWrapperRefType = {
  setToggleList: Dispatch<SetStateAction<boolean>>;
};

const ListWrapper = forwardRef<ListWrapperRefType, Props>(
  (
    {
      btnData: { children: btnChildren, ...btnAttr },
      children,
      outOfFlow,
      disabled,
      ...attr
    },
    ref
  ) => {
    const [toggleList, setToggleList] = useState(false);

    // refs
    const wrapperRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const lastHolderRef = useRef<HTMLDivElement>(null);
    const firstHolderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const wrapper = wrapperRef.current;
      const firstHolder = firstHolderRef.current;

      if (firstHolder && wrapper) {
        const timeout =
          parseFloat(getComputedStyle(firstHolder).transitionDuration) * 1000;

        if (toggleList) {
          wrapper.style.overflow = "visible";
        } else
          setTimeout(() => wrapper.style.removeProperty("overflow"), timeout);
      }
    }, [toggleList]);

    useEffect(() => {
      // const list = lastHolderRef.current;
      const btn = btnRef.current;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clickFunc = (e: any) => {
        !btn?.isEqualNode(e.target) ? setToggleList(false) : null;
      };

      const keyDownFunc = (e: KeyboardEvent) =>
        e.key === "Escape" ? setToggleList(false) : null;

      // closeing selectList
      window.addEventListener("click", clickFunc);
      window.addEventListener("keydown", keyDownFunc);

      // if (outOfFlow?.value && !outOfFlow.fullWidth) {
      //   if (list && btn) {
      //     const btnStyles = getComputedStyle(btn);
      //     const additionWidth = [
      //       btnStyles.gap,
      //       btnStyles.paddingLeft,
      //       btnStyles.paddingRight,
      //     ]
      //       .map((style) => +style.replace("px", ""))
      //       .reduce((a, c) => a + c);

      //     [btn, list].forEach(
      //       (el) => (el.style.width = `${list.offsetWidth + additionWidth}px`)
      //     );
      //   }
      // }

      return () => {
        window.removeEventListener("click", clickFunc);
        window.removeEventListener("keydown", keyDownFunc);

        // if (outOfFlow && list && btn) {
        //   [btn, list].forEach((el) => el.style.removeProperty("width"));
        // }
      };
    }, []);

    useImperativeHandle(ref, () => ({ setToggleList }), []);

    let listClassName = "list-wrapper";
    listClassName += toggleList ? " active" : "";
    listClassName += attr.className ? ` ${attr.className}` : "";
    listClassName += outOfFlow?.value ? " out-of-flow" : "";
    listClassName +=
      outOfFlow?.value && !outOfFlow.fullWidth ? " custom-width" : "";

    let listBtnClassName = "list-wrapper-btn";
    listBtnClassName += disabled?.value ? " disabled" : "";
    listBtnClassName += btnAttr?.className ? ` ${btnAttr.className}` : "";

    return (
      <div {...attr} className={listClassName} ref={wrapperRef}>
        <button
          ref={btnRef}
          title="toggle list btn"
          {...btnAttr}
          className={listBtnClassName}
          onClick={(e) => {
            setToggleList((p) => !p);
            btnAttr.onClick?.(e);
          }}
          disabled={disabled?.value}
        >
          {btnChildren}
          <Arrow active={toggleList} />
        </button>

        <div
          ref={firstHolderRef}
          className="list-wrapper-first-holder"
          style={
            {
              "--max-height": `calc(100vh - (${
                lastHolderRef.current?.parentElement?.getBoundingClientRect()
                  .top || 0
              }px + 10px))`,
            } as CSSProperties
          }
        >
          <div className="list-wrapper-last-holder" ref={lastHolderRef}>
            {children}
          </div>
        </div>
      </div>
    );
  }
);
export default ListWrapper;
