// react
import { useRef, useState } from "react";

// components
import TopMessage, { type TopMessageRefType } from "../TopMessage";
import AreYouSureModal from "../modals/AreYouSureModal";

// types
import { type InlineDeleteBtnType } from "./DangerZone";
import { type AppModalRefType } from "../modals/appModal/AppModal";

const DangerZoneBtn = ({
  content,
  modalMsg,
  onAcceptFn,
}: InlineDeleteBtnType) => {
  const sureModalRef = useRef<AppModalRefType>(null);
  const msgRef = useRef<TopMessageRefType>(null);
  const [toggleClosingFunctions, setToggleClosingFunctions] = useState(true);

  return (
    <>
      <button
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
            acceptBtn?.classList.add(
              "center",
              "scale",
              "spinner-pseudo-after",
              "fade"
            );

            acceptBtn.parentElement?.parentElement?.parentElement
              ?.querySelectorAll("button")
              .forEach((btn) => (btn.disabled = true));

            setTimeout(() => acceptBtn?.classList.add("active"));
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
