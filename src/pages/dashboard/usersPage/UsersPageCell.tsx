// react
import type { Dispatch, RefObject, SetStateAction } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// components
import GridListItem from "../../../components/gridList/GridListItem";
import DeleteUserBtn from "../../../components/DeleteUserBtn";

// types
import type { AppModalRefType } from "../../../components/modals/appModal/AppModal";
import type { OrderType, UserType } from "../../../utils/types";

type Props = {
  user: UserType & { orders: OrderType[] };
  setSelectedUsername: Dispatch<SetStateAction<string>>;
  setSelectedUserId: Dispatch<SetStateAction<string>>;
  modalRef: RefObject<AppModalRefType>;
  cells: string[];
};

const IsAdmin = ({ val }: { val: boolean }) => (
  <span
    style={{
      fontWeight: "bold",
      letterSpacing: 1,
      fontSize: 18,
      color: val ? "rgb(4 131 4)" : "unset",
    }}
  >
    {val.toString()}
  </span>
);

const ShowOrdersBtn = ({
  userId,
  username,
  setSelectedUsername,
  setSelectedUserId,
  modalRef,
}: {
  userId: string;
  username: string;
  setSelectedUsername: Props["setSelectedUsername"];
  setSelectedUserId: Props["setSelectedUserId"];
  modalRef: Props["modalRef"];
}) => (
  <button
    title="show user orders btn"
    className="btn"
    onClick={() => {
      modalRef.current?.setOpenModal(true);
      setSelectedUserId(userId);
      setSelectedUsername(username);
    }}
  >
    show orders
  </button>
);

const UsersPageCell = ({
  user: { _id, isAdmin, email, address, username, orders },
  setSelectedUsername,
  setSelectedUserId,
  modalRef,
  cells,
}: Props) => {
  return (
    <GridListItem
      cells={cells}
      itemData={{
        isAdmin: <IsAdmin val={isAdmin} />,
        email,
        username: (
          <Link
            title="go to single user page btn"
            className="btn"
            style={{ width: "100%" }}
            to={"/dashboard/singleUser/" + _id}
            relative="path"
          >
            {username}
          </Link>
        ),
        address: address || "no address!",
        orders: orders?.length ? (
          <ShowOrdersBtn
            modalRef={modalRef}
            username={username}
            userId={_id}
            setSelectedUsername={setSelectedUsername}
            setSelectedUserId={setSelectedUserId}
          />
        ) : (
          "no orders!"
        ),
        delete: (
          <DeleteUserBtn
            style={{ width: "100%" }}
            userId={_id}
            username={username}
          >
            delete
          </DeleteUserBtn>
        ),
      }}
    />
  );
};
export default UsersPageCell;
