// react
import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,

  // types
  type ReactNode,
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";

// framer motion
import { AnimatePresence, type HTMLMotionProps, motion } from "framer-motion";

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
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  appModalEl: HTMLDivElement | null;
};

const AppModal = forwardRef<AppModalRefType, AppModalProps>(
  ({ children, toggleClosingFunctions, afterMountFn, ...attr }, ref) => {
    const [openModal, setOpenModal] = useState(false);

    const appModalEl = useRef<HTMLDivElement>(null);
    const overlayEl = useRef<HTMLDivElement>(null);
    const closeBtnEl = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (openModal) {
        if (!document.body.classList.contains("block-scroll")) {
          document.body.classList.add("block-scroll");
        }
      } else {
        if (document.body.classList.contains("block-scroll")) {
          document.body.classList.remove("block-scroll");
        }
      }

      afterMountFn?.({
        closeBtnEl: closeBtnEl.current,
        overlayEl: overlayEl.current,
        modalEl: appModalEl.current,
      });

      const overlay = overlayEl.current;
      const appModal = appModalEl.current;

      if (overlay && appModal) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clickFunc = (e: any) => {
          if (toggleClosingFunctions)
            // if clicked element in the document is modal overlay => we will close modal => by taking the value of condition and reverse it
            setOpenModal(!(e.target.id === overlay.id));
        };
        // if press key in keyboard is Escape => we will close modal => by taking the value of condition and reverse it
        const keyDownFunc = (e: KeyboardEvent) =>
          setOpenModal(
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

    useImperativeHandle(
      ref,
      () => ({ setOpenModal, appModalEl: appModalEl.current }),
      []
    );

    return createPortal(
      <AnimatePresence>
        {openModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
              }}
              ref={overlayEl}
              className="overlay no-animation"
              id="app-modal-overlay"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              {...(attr as HTMLMotionProps<"div">)}
              ref={appModalEl}
              className={`app-modal modal${
                attr.className ? ` ${attr.className}` : ""
              }`}
            >
              <motion.button
                initial={{ y: 45 }}
                animate={{ y: 0 }}
                exit={{ y: 45 }}
                title="close app modal btn"
                ref={closeBtnEl}
                className="modal-close-btn red-btn"
                onClick={() => setOpenModal(false)}
              >
                X
              </motion.button>
              <div className="app-modal-cells-holder">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);

export default AppModal;
