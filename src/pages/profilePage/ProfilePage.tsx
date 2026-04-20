// react
import { useEffect, useState } from "react";

// react router
import { useLocation, useNavigate, useParams } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useSelector from "../../hooks/redux/useSelector";

// components
import EmptyPage from "../../components/layout/EmptyPage";
import DangerZone from "../../components/dangerZone/DangerZone";
import DeleteUserBtn from "../../components/DeleteUserBtn";
import Heading from "../../components/Heading";
import SplashScreen from "../../components/spinners/SplashScreen";
import TabsList from "../../components/TabsList";
import CartPage from "../e-commerce/cartPage/CartPage";
import WishlistPage from "../e-commerce/wishlistPage/WishlistPage";
import ProfilePageUserInfo from "./components/ProfilePageUserInfo";

// SVGs
import notFoundSvg from "../../../imgs/404.svg";

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

  const [user, setUser] = useState<UserType | null>(
    isCurrentUserProfile ? appUser : null,
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
  if (!user) {
    return (
      <EmptyPage
        content="User with given ID not founded !"
        svg={notFoundSvg}
        withBtn={{ type: "GoToHome" }}
      />
    );
  }

  const { username, _id } = user;

  return (
    <AnimatedLayout>
      <Heading>
        {isCurrentUserProfile ? "Your Profile" : "Profile Page"}
      </Heading>

      <ProfilePageUserInfo
        isCurrentUserProfile={isCurrentUserProfile}
        user={user}
      />

      <hr style={{ marginBlock: 15 }} />

      {!isCurrentUserProfile && (
        <>
          <TabsList
            lists={[
              {
                tabName: "User Cart",
                tabContent: <CartPage userId={user._id} />,
              },
              {
                tabName: "User wishlist",
                tabContent: <WishlistPage userId={user._id} />,
              },
            ]}
          />

          <hr style={{ marginBlock: 15 }} />
        </>
      )}

      <DangerZone
        content={
          isCurrentUserProfile
            ? "delete your account, you can't restore your account after delete it."
            : "delete this user's account, you can't restore it after delete it."
        }
        title="Danger Zone"
        deleteBtn={{
          type: "custom",
          deleteBtn: (
            <DeleteUserBtn
              style={{ marginInline: "auto" }}
              userId={_id}
              username={username}
            >
              Delete {isCurrentUserProfile ? "your" : "this user's"} account
            </DeleteUserBtn>
          ),
        }}
      />
    </AnimatedLayout>
  );
};

export default ProfilePage;
