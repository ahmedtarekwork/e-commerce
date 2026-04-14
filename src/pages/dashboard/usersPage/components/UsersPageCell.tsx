// react
import type { Dispatch, RefObject, SetStateAction } from "react";

// react-router-dom
import { Link } from "react-router-dom";

// components
import GridListItem from "../../../../components/gridList/GridListItem";
import DeleteUserBtn from "../../../../components/DeleteUserBtn";
import IsUserAdmin from "./IsUserAdmin";
import ShowOrdersBtn from "./ShowOrdersBtn";

// types
import type { AppModalRefType } from "../../../../components/modals/appModal/AppModal";
import type { OrderType, UserType } from "../../../../utils/types";

// icons
import { FcHome } from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import { FaUserTag } from "react-icons/fa";

export type UsersPageCellProps = {
  user: UserType & { orders: OrderType[] };
  setSelectedUsername: Dispatch<SetStateAction<string>>;
  setSelectedUserId: Dispatch<SetStateAction<string>>;
  modalRef: RefObject<AppModalRefType>;
  cells: string[];
};

const UsersPageCell = ({
  user: { _id, isAdmin, email, address, username, orders },
  setSelectedUsername,
  setSelectedUserId,
  modalRef,
  cells,
}: UsersPageCellProps) => {
  return (
    <GridListItem
      cells={cells}
      itemData={{
        isAdmin: <IsUserAdmin val={isAdmin} />,
        email: <p className="users-page-cell-email">{email}</p>,
        username: (
          <Link
            title="go to single user page btn"
            className="btn users-page-username-btn user-page-cell-btn"
            to={"/dashboard/singleUser/" + _id}
            relative="path"
          >
            <FaUserTag size={20} />
            {username}
          </Link>
        ),
        address: address || (
          <p className="users-page-cell-text">
            <FcHome size={20} />
            NO_ADDRESS !
          </p>
        ),
        orders: (
          <ShowOrdersBtn
            orders={orders}
            modalRef={modalRef}
            username={username}
            userId={_id}
            setSelectedUsername={setSelectedUsername}
            setSelectedUserId={setSelectedUserId}
          />
        ),
        delete: (
          <DeleteUserBtn
            style={{ width: "100%" }}
            userId={_id}
            username={username}
          >
            <MdDelete size={20} />
            Delete
          </DeleteUserBtn>
        ),
      }}
    />
  );
};
export default UsersPageCell;
