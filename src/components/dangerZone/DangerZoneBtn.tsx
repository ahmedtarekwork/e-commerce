// react
import { useRef, useState } from "react";

// components
import TopMessage, { type TopMessageRefType } from "../TopMessage";
import AreYouSureModal, { type SureModalRef } from "../modals/AreYouSureModal";

// types
import { type InlineDeleteBtnType } from "./DangerZone";

const DangerZoneBtn = ({
  content,
  modalMsg,
  onAcceptFn,
}: InlineDeleteBtnType) => {
  const sureModalRef = useRef<SureModalRef>(null);
  const msgRef = useRef<TopMessageRefType>(null);
  const [toggleClosingFunctions, setToggleClosingFunctions] = useState(true);

  return (
    <>
      <button
        title="danger zone red"
        onClick={() => sureModalRef.current?.toggleModal(true)}
        className="red-btn danger-zone-btn"
      >
        {content}
      </button>

      <AreYouSureModal
        ref={sureModalRef}
        toggleClosingFunctions={toggleClosingFunctions}
        functionToMake={(e) => {
          const acceptBtn = e.currentTarget;

          if (acceptBtn) {
            sureModalRef.current?.setShowYesSpinner(true);

            acceptBtn.parentElement?.parentElement?.parentElement
              ?.querySelectorAll("button")
              .forEach((btn) => (btn.disabled = true));
          }
          setToggleClosingFunctions(false);
          onAcceptFn(e);
        }}
      >
        {modalMsg}
      </AreYouSureModal>

      <TopMessage ref={msgRef} />
    </>
  );
};
export default DangerZoneBtn;
