// react
import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useEffect,
} from "react";

// react-router-dom
import { Link } from "react-router-dom";

// redux
import useDispatch from "../../../hooks/redux/useDispatch";
import useSelector from "../../../hooks/redux/useSelector";
// redux actions
import { logoutUser } from "../../../store/fetures/userSlice";

// components
import GridListItem from "../../../components/gridList/GridListItem";
import useDeleteUserBtn from "../../../hooks/ReactQuery/useDeleteUserBtn";

// utiles
import handleError from "../../../utiles/functions/handleError";

// types
import type { AppModalRefType } from "../../../components/modals/appModal/AppModal";
import type { TopMessageRefType } from "../../../components/TopMessage";
import type { OrderType, UserType } from "../../../utiles/types";

type Props = {
  user: UserType & { orders: OrderType[] };
  setSelectedUsername: Dispatch<SetStateAction<string>>;
  setSelectedUserId: Dispatch<SetStateAction<string>>;
  selectedUserId: string;
  modalRef: RefObject<AppModalRefType>;
  msgRef: RefObject<TopMessageRefType>;
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
      modalRef.current?.toggleModal(true);
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
  selectedUserId,
  modalRef,
  msgRef,
  cells,
}: Props) => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const {
    deleteBtn,
    deleteErr,
    deleteErrData,
    deleteSuccess,
    reset,
    deletedUserData,
  } = useDeleteUserBtn(selectedUserId);

  useEffect(() => {
    if (deleteErr) {
      handleError(
        deleteErrData,
        msgRef,
        {
          forAllStates: "something went wrong while deleting the user",
        },
        5000
      );
    }
  }, [deleteErr, deleteErrData, msgRef]);

  useEffect(() => {
    if (deleteSuccess) {
      if (deletedUserData._id === user?._id) {
        dispatch(logoutUser());
        reset();
      } else {
        msgRef.current?.setMessageData?.({
          clr: "green",
          content: "user deleted successfully",
          show: true,
          time: 3500,
        });
        setTimeout(() => reset(), 3500);
      }
    }
  }, [deleteSuccess, reset, dispatch, deletedUserData, user?._id, msgRef]);

  const DeleteBtn = () =>
    deleteBtn({
      itemId: _id,
      username,
      children: "delete",
    });

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
        delete: <DeleteBtn />,
      }}
    />
  );
};
export default UsersPageCell;
