import { forwardRef, useImperativeHandle, useRef, MouseEvent } from "react";
import { createPortal } from "react-dom";

import AppModal, {
  type AppModalRefType,
  type AppModalProps,
} from "./appModal/AppModal";

type SureModalProps = AppModalProps & {
  functionToMake: (e: MouseEvent<HTMLButtonElement>) => void;
  btnsContent?: Record<"yes" | "no", string>;
};

const AreYouSureModal = forwardRef<AppModalRefType, SureModalProps>(
  (props: SureModalProps, ref) => {
    // props
    const { children, toggleClosingFunctions, functionToMake, ...attr } = props;

    // refs
    const acceptBtn = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<AppModalRefType>({ toggleModal: () => {} });

    useImperativeHandle(ref, () => modalRef.current, []);

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
            className="btn"
            data-modal-status="accept"
            ref={acceptBtn}
            onClick={(e) => {
              functionToMake(e);
            }}
          >
            {props.btnsContent?.yes || "Yes"}
          </button>

          <button
            className="red-btn"
            data-modal-status="cancel"
            onClick={() => modalRef.current?.toggleModal(false)}
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
