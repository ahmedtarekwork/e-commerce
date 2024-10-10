// react
import {
  useRef,
  useEffect,

  // types
  type ComponentProps,
  type ReactNode,
} from "react";

// redux
import useDeleteUser from "../hooks/ReactQuery/useDeleteUser";
import useSelector from "../hooks/redux/useSelector";

// components
import BtnWithSpinner from "./animatedBtns/BtnWithSpinner";
import AreYouSureModal, { type SureModalRef } from "./modals/AreYouSureModal";

export type DeleteUserBtnProps = Record<"username" | "userId", string> & {
  children: ReactNode;
} & ComponentProps<"button">;

const DeleteUserBtn = ({
  username,
  userId,
  children,
  className,
  ...attr
}: DeleteUserBtnProps) => {
  const { user } = useSelector((state) => state.user);

  // refs
  const sureModal = useRef<SureModalRef>(null);

  const { mutate: deleteUser, isPending: deleteLoading } = useDeleteUser();

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
          attr.onClick?.(e);

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
        functionToMake={() => deleteUser(userId)}
        ref={sureModal}
      >
        Are you sure you want to{" "}
        {user?._id === userId ? (
          <span style={{ fontWeight: "bold", color: "var(--danger)" }}>
            delete your account
          </span>
        ) : (
          <>
            delete "
            <span style={{ color: "var(--danger)", fontWeight: "bold" }}>
              {username}
            </span>
            " user
          </>
        )}
      </AreYouSureModal>
    </>
  );
};

export default DeleteUserBtn;
