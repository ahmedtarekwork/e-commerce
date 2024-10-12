import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,

  // types
  type SetStateAction,
  type Dispatch,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";

import EmptySpinner from "../spinners/EmptySpinner";
import AppModal, {
  type AppModalRefType,
  type AppModalProps,
} from "./appModal/AppModal";

type SureModalProps = AppModalProps & {
  functionToMake: (e: MouseEvent<HTMLButtonElement>) => void;
  btnsContent?: Record<"yes" | "no", string>;
};

export type SureModalRef = AppModalRefType & {
  setShowYesSpinner: Dispatch<SetStateAction<boolean>>;
};

const AreYouSureModal = forwardRef<SureModalRef, SureModalProps>(
  (props: SureModalProps, ref) => {
    const { children, toggleClosingFunctions, functionToMake, ...attr } = props;

    const [showYesSpinner, setShowYesSpinner] = useState(false);

    // refs
    const acceptBtn = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<AppModalRefType>({
      setOpenModal: () => {},
      appModalEl: null,
    });

    useImperativeHandle(
      ref,
      () => ({ ...modalRef.current, setShowYesSpinner }),
      []
    );

    return createPortal(
      <AppModal
        {...attr}
        className={`are-you-sure-modal${
          attr.className ? ` ${attr.className}` : ""
        }`}
        toggleClosingFunctions={toggleClosingFunctions}
        ref={modalRef}
      >
        <p>{children}</p>

        <div className="btns-holder">
          <button
            title="accept"
            className="btn are-you-sure-modal-accept-btn"
            data-modal-status="accept"
            ref={acceptBtn}
            onClick={(e) => {
              functionToMake(e);
            }}
          >
            {props.btnsContent?.yes || "Yes"}
            {showYesSpinner && (
              <EmptySpinner
                settings={{
                  diminsions: "20px",
                  clr: "white",
                }}
              />
            )}
          </button>

          <button
            title="cencel"
            className="red-btn"
            data-modal-status="cancel"
            onClick={() => modalRef.current?.setOpenModal(false)}
          >
            {props.btnsContent?.no || "No"}
          </button>
        </div>
      </AppModal>,
      document.body
    );
  }
);

export default AreYouSureModal;
