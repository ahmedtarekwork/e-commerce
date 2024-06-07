// react
import { useEffect, useRef, useState } from "react";

// react router
import { Link, useLocation, useParams } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useSelector from "../../hooks/redux/useSelector";
import useDispatch from "../../hooks/redux/useDispatch";
// redux actions
import { logoutUser } from "../../store/fetures/userSlice";

// components
import ProfilePageCell from "./ProfilePageCell";
import ProfilePageOrdersArea from "./ProfilePageOrdersArea";
import CartArea from "../../components/CartArea";
import Heading from "../../components/Heading";
import SplashScreen from "../../components/spinners/SplashScreen";
import TopMessage, {
  type TopMessageRefType,
} from "../../components/TopMessage";
import TabsList from "../../components/TabsList";
import WishlistArea from "../../components/WishlistArea";
import PropCell from "../../components/PropCell";

// icons
import { FaDonate } from "react-icons/fa";

// hooks
import useDeleteUserBtn from "../../hooks/ReactQuery/useDeleteUserBtn";

// utiles
import { axiosWithToken } from "../../utiles/axios";
import handleError from "../../utiles/functions/handleError";

// types
import type { UserType } from "../../utiles/types";
import DangerZone from "../../components/dangerZone/DangerZone";

// fetchers
const getUserQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: string[];
}) => {
  return (await axiosWithToken("users/" + id)).data;
};

const ProfilePage = () => {
  const dispatch = useDispatch();

  const msgRef = useRef<TopMessageRefType>(null);

  const { pathname } = useLocation();
  const { id } = useParams();
  const isCurrentUserProfile = !pathname.includes("singleUser");

  const {
    data: resUser,
    isPending: userLoading,
    refetch: getUser,
    fetchStatus,
  } = useQuery({
    queryKey: ["getUser", id || ""],
    queryFn: getUserQueryFn,
    enabled: false,
  });

  const { user: appUser } = useSelector((state) => state.user);

  const allUsers = useSelector((state) => state.user.allUsers);
  const singleUser = allUsers.find(({ _id }) => _id === id) || null;

  const [user, setUser] = useState<UserType | null>(
    isCurrentUserProfile ? appUser : singleUser
  );
  const withId = isCurrentUserProfile ? {} : { userId: user?._id };

  // delete user account hook
  const { deleteBtn, deleteErr, deleteErrData, deleteSuccess, reset } =
    useDeleteUserBtn(user?._id);

  // useEffects
  // if no user => send request to get user
  useEffect(() => {
    if (!user) getUser();
  }, []);

  useEffect(() => {
    if (resUser) setUser(resUser);
  }, [resUser]);

  useEffect(() => {
    if (deleteErr) {
      handleError(
        deleteErrData,
        msgRef,
        {
          forAllStates:
            "something went wrong while trying to delete your account",
        },
        4000
      );
      setTimeout(() => reset(), 4000);
    }
  }, [deleteErr, deleteErrData, reset]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(logoutUser());
      reset();
    }
  }, [deleteSuccess, dispatch, reset]);

  if (userLoading && fetchStatus !== "idle") return <SplashScreen />;
  if (!user) return <h1>No User Has Been Founded</h1>;

  const { username, email, _id } = user;

  const DeleteBtn = () =>
    deleteBtn({
      itemId: _id,
      username,
      children: "delete your account",
    });

  return (
    <>
      <div className="section">
        <Heading
          content={isCurrentUserProfile ? "Your Profile" : "Profile Page"}
        />
      </div>

      <ProfilePageCell user={user} propName={"username"} content={username} />
      <ProfilePageCell user={user} propName={"email"} content={email} />

      <ProfilePageCell
        user={user}
        propName={"address"}
        content={user?.address || "no address found!"}
      />
      <PropCell
        name={"donationPlan"}
        val={
          <p className="profile-page-donation-cell">
            {user?.donationPlan ? (
              <>
                {isCurrentUserProfile ? "you are" : "this user"} subscriped to
                <strong className="plan-name">{user.donationPlan}</strong>
              </>
            ) : (
              `${
                isCurrentUserProfile ? "you aren't" : "this user doesn't"
              } subscriped to any donation plan`
            )}

            {isCurrentUserProfile && (
              <Link className="btn" to="/donate" relative="path">
                {user.donationPlan ? (
                  "change plan"
                ) : (
                  <>
                    <FaDonate />
                    Go to Donate
                  </>
                )}
              </Link>
            )}
          </p>
        }
      />

      <hr style={{ marginBlock: 15 }} />

      {!isCurrentUserProfile ? (
        <TabsList
          lists={[
            {
              tabName: "User Cart",
              tabContent: <CartArea {...withId} />,
            },
            {
              tabName: "User Orders",
              tabContent: (
                <ProfilePageOrdersArea
                  user={user}
                  isCurrentUserProfile={isCurrentUserProfile}
                />
              ),
            },
            {
              tabName: "User wishlist",
              tabContent: (
                <WishlistArea
                  wishlist={user.wishlist}
                  isCurrentUserProfile={isCurrentUserProfile}
                />
              ),
            },
          ]}
        />
      ) : (
        <WishlistArea
          wishlist={user.wishlist}
          isCurrentUserProfile={isCurrentUserProfile}
        />
      )}

      <hr style={{ marginBlock: 15 }} />

      <DangerZone
        content="delete your account, you can't restore your account after delete it."
        title="Danger Zone"
        deleteBtn={{
          type: "custom",
          deleteBtn: <DeleteBtn />,
        }}
      />

      <TopMessage ref={msgRef} />
    </>
  );
};

export default ProfilePage;
