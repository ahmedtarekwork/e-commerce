// icons
import { FaUserTag } from "react-icons/fa";

// redux
import useSelector from "../../../../hooks/redux/useSelector";

// types
import type { UserType } from "../../../../utils/types";

const GoToUserProfileBtn = ({
  _id,
  username,
}: Pick<UserType, "_id" | "username">) => {
  const currentUser = useSelector((state) => state.user.user);

  return (
    <a
      title="go to single user page btn"
      className="btn users-page-username-btn user-page-cell-btn"
      href={
        currentUser?._id === _id ? "/profile" : "/dashboard/singleUser/" + _id
      }
      target="_blank"
    >
      <FaUserTag size={23} />
      <p>{username}</p>
    </a>
  );
};
export default GoToUserProfileBtn;
