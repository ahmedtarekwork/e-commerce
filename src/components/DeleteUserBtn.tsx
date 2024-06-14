// react
import { type ComponentProps, useEffect, useRef } from "react";

// components
import AreYouSureModal from "./modals/AreYouSureModal";

// types
import { type UseMutateFunction } from "@tanstack/react-query";
import { type AppModalRefType } from "./modals/appModal/AppModal";

export type DeleteUserBtnProps = Record<"username" | "itemId", string> & {
  deleteLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteItem: UseMutateFunction<any, Error, string, unknown>;
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
  const sureModal = useRef<AppModalRefType>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.classList.toggle("active", deleteLoading);
  }, [deleteLoading]);

  return (
    <>
      <button
        title="delete user btn"
        ref={btnRef}
        {...attr}
        className={`red-btn${
          deleteLoading ? " center fade scale spinner-pseudo-after" : ""
        }${" " + (className || "")}`}
        disabled={deleteLoading}
        onClick={(e) => {
          onClick?.(e);

          sureModal.current?.toggleModal(true);
        }}
      >
        {children}
      </button>

      <AreYouSureModal
        afterMountFn={({ modalEl: modal }) => {
          if (!modal) return;

          const allBtns = [...modal.querySelectorAll("button")];
          const acceptBtn = allBtns.find(
            (b) => b.dataset.modalStatus === "accept"
          );

          allBtns.forEach((btn) => (btn.disabled = deleteLoading));

          if (acceptBtn) {
            acceptBtn.classList[deleteLoading ? "add" : "remove"](
              "center",
              "fade",
              "scale",
              "spinner-pseudo-after"
            );

            setTimeout(() =>
              acceptBtn.classList.toggle("active", deleteLoading)
            );
          }
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
