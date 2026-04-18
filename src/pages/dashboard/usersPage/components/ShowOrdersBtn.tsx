// types
import type { OrderType } from "../../../../utils/types";
import type { UsersPageCellProps } from "./UsersPageCell";

// icons
import { GiBoxUnpacking } from "react-icons/gi";
import { LuBoxes } from "react-icons/lu";

type Props = {
  userId: string;
  username: string;
  setSelectedUsername: UsersPageCellProps["setSelectedUsername"];
  setSelectedUserId: UsersPageCellProps["setSelectedUserId"];
  modalRef: UsersPageCellProps["modalRef"];
  orders: OrderType[];
};

const ShowOrdersBtn = ({
  orders,
  userId,
  username,
  setSelectedUsername,
  setSelectedUserId,
  modalRef,
}: Props) => {
  if (!orders?.length) {
    return (
      <p className="users-page-cell-text" data-testid="no-orders-msg">
        <GiBoxUnpacking size={20} />
        NO_ORDERS !
      </p>
    );
  }

  return (
    <button
      data-testid="show-orders-btn"
      title="show user orders btn"
      className="btn user-page-cell-btn"
      onClick={() => {
        modalRef.current?.setOpenModal(true);
        setSelectedUserId(userId);
        setSelectedUsername(username);
      }}
    >
      <LuBoxes size={20} />
      show orders
    </button>
  );
};
export default ShowOrdersBtn;
