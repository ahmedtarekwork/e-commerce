// react
import { useEffect, useRef, useState } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// react router
import { useLocation, useParams } from "react-router-dom";

// redux
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import useDispatch from "../../hooks/useDispatch";
// redux actions
import { logoutUser } from "../../store/fetures/userSlice";

// components
import ProfilePageCell from "./ProfilePageCell";
import ProfilePageOrdersArea from "./ProfilePageOrdersArea";
import CartArea from "../../components/CartArea";
import Heading from "../../components/Heading";
import SplashScreen from "../../components/spinners/SplashScreen";
import TopMessage, { TopMessageRefType } from "../../components/TopMessage";
import TabsList from "../../components/TabsList";
import WishlistArea from "../../components/WishlistArea";

// hooks
import useDeleteUserBtn from "../../hooks/useDeleteUserBtn";

// utiles
import { axiosWithToken } from "../../utiles/axios";
import handleError from "../../utiles/functions/handleError";

// types
import { RootStateType, UserType } from "../../utiles/types";

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

  const { user: appUser } = useSelector((state: RootStateType) => state.user);

  const allUsers = (state: RootStateType) => state.user.allUsers;
  const userSelector = createSelector<[typeof allUsers], UserType | null>(
    allUsers,
    (state: RootStateType["user"]["allUsers"]) =>
      state.find(({ _id }) => _id === id) || null
  );
  const singleUser = useSelector((state: RootStateType) => userSelector(state));

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
    deleteBtn({ itemId: _id, username, children: "delete your account" });

  return (
    user && (
      <>
        <div className="section">
          <Heading
            content={isCurrentUserProfile ? "Your Profile" : "Profile Page"}
          />
        </div>

        <ProfilePageCell user={user} propName={"username"} content={username} />
        <ProfilePageCell user={user} propName={"email"} content={email} />

        {user?.address ? (
          <ProfilePageCell
            user={user}
            propName={"address"}
            content={user?.address}
          />
        ) : (
          <ProfilePageCell
            user={user}
            propName={"address"}
            content={"not address has found!"}
          />
        )}

        <hr style={{ marginBottom: 15 }} />

        {!isCurrentUserProfile && (
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
        )}

        {isCurrentUserProfile && (
          <>
            <WishlistArea
              wishlist={user.wishlist}
              isCurrentUserProfile={isCurrentUserProfile}
            />
          </>
        )}

        <hr style={{ marginBlock: 15 }} />

        <div className="delete-user-btn-holder">
          <DeleteBtn />
        </div>

        <TopMessage ref={msgRef} />
      </>
    )
  );
};

export default ProfilePage;
