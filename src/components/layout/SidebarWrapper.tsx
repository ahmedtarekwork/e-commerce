import {
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  forwardRef,

  // types
  type Dispatch,
  type SetStateAction,
  type ComponentProps,
  type ReactNode,
} from "react";

export type SidebarWraperComponentRefType = {
  setToggleSidebar: Dispatch<SetStateAction<boolean>>;
  sidebar: HTMLElement | null;
};

type Props = {
  children: ReactNode;

  /* "closeList property": {
      list[] property => if the element inside it has been clicked it will close the sidebar
      reversedList[] => if the element inside it has been clicked it willn't close the sidebar, but if any other element has been clicked it will close the sidebar
    }
  */

  closeList?: Partial<Record<"list" | "reversedList", (HTMLElement | null)[]>>;
  insideClose: boolean;
} & ComponentProps<"aside">;

const SidebarWrapper = forwardRef<SidebarWraperComponentRefType, Props>(
  ({ closeList, children, insideClose, ...attr }, ref) => {
    const [toggleSidebar, setToggleSidebar] = useState(false);

    const sidebarRef = useRef<HTMLElement>(null);

    useImperativeHandle(
      ref,
      () => ({ setToggleSidebar, sidebar: sidebarRef?.current }),
      []
    );

    useEffect(() => {
      if (toggleSidebar) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.removeProperty("overflow");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clickFunc = (e: any) => {
        // don't close sidebar if the clicked element is inside the sidebar
        const insideCloseList = insideClose
          ? sidebarRef?.current?.querySelectorAll("*") || []
          : [];

        const insideNotCloseList = !insideClose
          ? sidebarRef?.current?.querySelectorAll("*") || []
          : [];

        if (
          [sidebarRef?.current, ...insideNotCloseList].some((el) =>
            el?.isEqualNode(e.target)
          )
        )
          return;

        if (toggleSidebar) {
          const list = [...(closeList?.list || []), ...insideCloseList].some(
            (el) => el?.isEqualNode(e.target)
          );
          const reversedlist =
            typeof closeList?.reversedList !== "undefined"
              ? !closeList.reversedList.some((el) => el?.isEqualNode(e.target))
              : false;

          if (reversedlist || list) setToggleSidebar(false);
        }
      };
      const keyDownFunc = (e: KeyboardEvent) => {
        if (toggleSidebar) {
          if (e.key.toLowerCase() === "escape") setToggleSidebar(false);
        }
      };

      window.addEventListener("keydown", keyDownFunc);
      window.addEventListener("click", clickFunc);

      return () => {
        window.removeEventListener("click", clickFunc);
        window.removeEventListener("keydown", keyDownFunc);
      };
    }, [toggleSidebar, closeList?.list, closeList?.reversedList, insideClose]); // don't change dependencies array

    useEffect(() => {
      // tracking header diminsions => so when width or height changes then we will fire the callback func inside tracker
      const header = document.querySelector(".app-header") as HTMLElement;
      const sidebar = sidebarRef?.current;

      if (header && sidebar) {
        const headerDim = new ResizeObserver(() => {
          sidebar.style.cssText = `
            height: calc(100% - ${header.offsetHeight}px);
            top: ${header.offsetHeight}px
          `;
        });
        headerDim.observe(header);

        return () => headerDim.unobserve(header);
      }
    }, [toggleSidebar]);

    return (
      <>
        <aside
          ref={sidebarRef}
          {...attr}
          className={`sidebar-wrapper${toggleSidebar ? " active" : ""}${
            attr.className ? ` ${attr.className}` : ""
          }`}
        >
          {children}
        </aside>

        <div
          onClick={() => setToggleSidebar(false)}
          className={`overlay${toggleSidebar ? " active" : ""}`}
        />
      </>
    );
  }
);
export default SidebarWrapper;
