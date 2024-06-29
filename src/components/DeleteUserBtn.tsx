// react
import { type ComponentProps, useRef, useEffect } from "react";

// components
import BtnWithSpinner from "./animatedBtns/BtnWithSpinner";
import AreYouSureModal, { type SureModalRef } from "./modals/AreYouSureModal";

// types
import { type UseMutateFunction } from "@tanstack/react-query";

export type DeleteUserBtnProps = Record<"username" | "itemId", string> & {
  deleteLoading: boolean;
  deleteItem: UseMutateFunction<unknown, Error, string, unknown>;
} & ComponentProps<"button">;

const DeleteItemBtn = ({
  username,
  itemId,
  deleteLoading,
  deleteItem,
  children,
  className,
  onClick,
  ...attr
}: DeleteUserBtnProps) => {
  const sureModal = useRef<SureModalRef>(null);

  useEffect(() => {
    sureModal.current?.setShowYesSpinner(deleteLoading);
  }, [deleteLoading]);

  return (
    <>
      <BtnWithSpinner
        toggleSpinner={deleteLoading}
        title="delete user"
        {...attr}
        className={`red-btn${className ? ` ${className}` : ""}`}
        disabled={deleteLoading}
        onClick={(e) => {
          onClick?.(e);

          sureModal.current?.toggleModal(true);
        }}
      >
        {children}
      </BtnWithSpinner>

      <AreYouSureModal
        afterMountFn={({ modalEl: modal }) => {
          if (!modal) return;

          const allBtns = [...modal.querySelectorAll("button")];
          allBtns.forEach((btn) => (btn.disabled = deleteLoading));
        }}
        toggleClosingFunctions={!deleteLoading}
        functionToMake={() => deleteItem(itemId)}
        ref={sureModal}
      >
        Are you sure you want to delete "
        <span style={{ color: "var(--dark)", fontWeight: "bold" }}>
          {username}
        </span>
        " user
      </AreYouSureModal>
    </>
  );
};

export default DeleteItemBtn;
