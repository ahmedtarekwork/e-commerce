import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  ReactNode,
  ComponentProps,
  Dispatch,
  SetStateAction,
} from "react";
import { createPortal } from "react-dom";

type afterMountFnParams = {
  closeBtnEl: HTMLButtonElement | null;
} & Record<"modalEl" | "overlayEl", HTMLDivElement | null>;

export type AppModalProps = ComponentProps<"div"> & {
  children: ReactNode;
  toggleClosingFunctions: boolean;

  afterMountFn?: ({
    closeBtnEl,
    overlayEl,
    modalEl,
  }: afterMountFnParams) => void;
};

export type AppModalRefType = {
  toggleModal: (open: boolean) => void;
};

const toggleModals = async (
  open: boolean,
  overlay: HTMLDivElement | null,
  modal: HTMLDivElement | null,
  closeBtn: HTMLButtonElement | null,
  setStateAfterClose?: Dispatch<SetStateAction<boolean>>,
  doAfterJopFunc?: () => unknown
): Promise<unknown> => {
  document.body.classList.toggle("block-scroll", open);

  if (!overlay || !modal || !closeBtn) {
    // const msg = "there are some elements required, but it's undefined";
    // console.error(msg);
    // throw new Error(msg);
    return;
  }

  if (open) {
    return new Promise((res) => {
      setTimeout(() => {
        overlay.classList.add("active");
        res("");
      }, 2);
    })
      .then(() => setTimeout(() => modal.classList.add("active"), 150))
      .then(() => setTimeout(() => closeBtn.classList.add("active"), 250))
      .finally(() => doAfterJopFunc?.());
  } else {
    closeBtn.classList.remove("active");

    return new Promise((res) => {
      setTimeout(() => {
        modal.classList.remove("active");
        res("");
      }, 180);
    })
      .then(() => {
        setTimeout(() => overlay.classList.remove("active"), 150);
      })
      .then(() => {
        setStateAfterClose &&
          setTimeout(() => setStateAfterClose(() => false), 150);
      })
      .finally(() => doAfterJopFunc?.());
  }
};

const AppModal = forwardRef<AppModalRefType, AppModalProps>(
  ({ children, toggleClosingFunctions, afterMountFn, ...attr }, ref) => {
    const [openModal, setOpenModal] = useState(false);

    const appModalEl = useRef<HTMLDivElement>(null);
    const overlayEl = useRef<HTMLDivElement>(null);
    const closeBtnEl = useRef<HTMLButtonElement>(null);

    const toggleModal = (open: boolean) => {
      if (open) {
        setOpenModal(true);
      } else {
        toggleModals(
          false,
          overlayEl.current,
          appModalEl.current,
          closeBtnEl.current,
          setOpenModal
        );
      }
    };

    useEffect(() => {
      afterMountFn?.({
        closeBtnEl: closeBtnEl.current,
        overlayEl: overlayEl.current,
        modalEl: appModalEl.current,
      });

      if (openModal) {
        toggleModals(
          true,
          overlayEl.current,
          appModalEl.current,
          closeBtnEl.current
        );
      }

      const overlay = overlayEl.current;
      const appModal = appModalEl.current;

      if (overlay && appModal) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clickFunc = (e: any) => {
          if (toggleClosingFunctions)
            // if clicked element in the document is modal overlay => we will close modal => by taking the value of condition and reverse it
            toggleModal(!(e.target.id === overlay.id));
        };
        // if press key in keyboard is Escape => we will close modal => by taking the value of condition and reverse it
        const keyDownFunc = (e: KeyboardEvent) =>
          toggleModal(
            !(e.key.toLowerCase() === "escape" && toggleClosingFunctions)
          );

        overlay.addEventListener("keydown", keyDownFunc);
        overlay.addEventListener("click", clickFunc);

        return () => {
          overlay.removeEventListener("keydown", keyDownFunc);
          overlay.removeEventListener("click", clickFunc);
        };
      }
    }, [openModal, afterMountFn, toggleClosingFunctions]);

    useImperativeHandle(ref, () => ({ toggleModal }), []);

    return (
      <>
        {openModal &&
          createPortal(
            <>
              <div
                ref={overlayEl}
                className="overlay"
                id="app-modal-overlay"
              ></div>
              <div
                {...attr}
                ref={appModalEl}
                className={
                  "app-modal modal" +
                  (attr.className ? ` ${attr.className}` : "")
                }
              >
                <button
                  ref={closeBtnEl}
                  className="modal-close-btn red-btn"
                  onClick={() => toggleModal(false)}
                >
                  X
                </button>
                <div className="app-modal-cells-holder">{children}</div>
              </div>
            </>,
            document.body
          )}
      </>
    );
  }
);

export default AppModal;
