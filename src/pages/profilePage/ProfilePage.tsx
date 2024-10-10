// react
import { useEffect, useState } from "react";

// react router
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useSelector from "../../hooks/redux/useSelector";

// components
import DeleteUserBtn from "../../components/DeleteUserBtn";
import ProfilePageCell from "./ProfilePageCell";
import ProfilePageOrdersArea from "./ProfilePageOrdersArea";
import CartArea from "../../components/cartArea/CartArea";
import Heading from "../../components/Heading";
import SplashScreen from "../../components/spinners/SplashScreen";
import TabsList from "../../components/TabsList";
import WishlistArea from "../../components/WishlistArea";
import PropCell from "../../components/PropCell";
import DangerZone from "../../components/dangerZone/DangerZone";

// icons
import { FaDonate } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";

// utils
import axios from "../../utils/axios";

// types
import type { UserType } from "../../utils/types";

// layouts
import AnimatedLayout from "../../layouts/AnimatedLayout";

// fetchers
const getUserQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, id],
}: {
  queryKey: string[];
}) => {
  return (await axios("users/" + id)).data;
};

const ProfilePage = () => {
  // react router
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isCurrentUserProfile = !pathname.includes("singleUser");

  // states
  const { user: appUser } = useSelector((state) => state.user);

  const allUsers = useSelector((state) => state.user.allUsers);
  const singleUser = allUsers.find(({ _id }) => _id === id) || null;

  const [user, setUser] = useState<UserType | null>(
    isCurrentUserProfile ? appUser : singleUser
  );

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

  // useEffects

  useEffect(() => {
    if (!isCurrentUserProfile) {
      if (id === appUser?._id) {
        navigate("/profile", { relative: "path", replace: false });
      } else {
        if (!user || user._id !== id) getUser();
      }
    }

    // if no user => send request to get user
    if (isCurrentUserProfile && !user) getUser();
  }, [isCurrentUserProfile, appUser, user, navigate, getUser, id]);

  useEffect(() => {
    if (resUser) setUser(resUser);
  }, [resUser]);

  useEffect(() => {
    if (isCurrentUserProfile) setUser(appUser);
  }, [appUser, isCurrentUserProfile]);

  if (userLoading && fetchStatus !== "idle") return <SplashScreen />;
  if (!user) return <h1>No user has been founded</h1>;

  const { username, email, _id } = user;

  return (
    <AnimatedLayout>
      <Heading>
        {isCurrentUserProfile ? "Your Profile" : "Profile Page"}
      </Heading>

      <ProfilePageCell
        user={user}
        propName="username"
        content={username}
        isCurrentUserProfile={isCurrentUserProfile}
      />
      <ProfilePageCell
        user={user}
        propName="email"
        content={email}
        isCurrentUserProfile={isCurrentUserProfile}
      />

      <ProfilePageCell
        user={user}
        propName="address"
        content={user?.address || "no address found!"}
        isCurrentUserProfile={isCurrentUserProfile}
      />
      <PropCell
        name="donationPlan"
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
              <Link
                title="go to donate page btn"
                className="btn"
                to="/donate"
                relative="path"
              >
                {user.donationPlan ? (
                  <>
                    <FaMoneyBillTransfer />
                    change plan
                  </>
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

      {!isCurrentUserProfile && (
        <>
          <TabsList
            lists={[
              {
                tabName: "User Cart",
                tabContent: <CartArea userId={user._id} />,
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
                    userId={user._id}
                    isCurrentUserProfile={isCurrentUserProfile}
                  />
                ),
              },
            ]}
          />

          <hr style={{ marginBlock: 15 }} />
        </>
      )}

      <DangerZone
        content="delete your account, you can't restore your account after delete it."
        title="Danger Zone"
        deleteBtn={{
          type: "custom",
          deleteBtn: (
            <DeleteUserBtn
              style={{ marginInline: "auto" }}
              userId={_id}
              username={username}
            >
              Delete your account
            </DeleteUserBtn>
          ),
        }}
      />
    </AnimatedLayout>
  );
};

export default ProfilePage;
