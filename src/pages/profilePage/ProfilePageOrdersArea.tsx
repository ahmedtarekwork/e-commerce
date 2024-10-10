// react
import { useEffect } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import OrdersArea from "../../components/orders/OrdersArea";
import UserAreaLoading from "../../components/UserAreaLoading";
import ProfilePageTabsError from "../../components/ProfilePageTabsError";

// utils
import axios from "../../utils/axios";

// types
import type { OrderType, UserType } from "../../utils/types";

// icons
import { TbMailboxOff } from "react-icons/tb";

type Props = {
  user: UserType;
  isCurrentUserProfile: boolean;
};

const getUserOrdersQueryFn = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, userId],
}: {
  queryKey: string[];
}): Promise<{ orders: OrderType[]; orderby: string }> => {
  if (!userId) throw new Error("user id is required");
  return (await axios("orders/user-orders/" + userId)).data;
};

const ProfilePageOrdersArea = ({ user, isCurrentUserProfile }: Props) => {
  // get user orders
  const {
    refetch: getUserOrders,
    data: userOrders,
    isError: userOrdersErr,
    isPending: userOrdersLoading,
  } = useQuery({
    queryKey: ["getUserOrders", user._id || ""],
    queryFn: getUserOrdersQueryFn,
    enabled: false,
  });

  useEffect(() => {
    if (user) getUserOrders();
  }, [user, getUserOrders]);

  if (!isCurrentUserProfile) {
    if (userOrdersLoading) {
      return (
        <UserAreaLoading isCurrentUserProfile={false}>
          Loading Orders...
        </UserAreaLoading>
      );
    }

    if (!userOrders?.orders?.length) {
      return (
        <ProfilePageTabsError
          Icon={TbMailboxOff}
          content="this user doesn't have any orders yet"
        />
      );
    }

    if (userOrdersErr) {
      return (
        <ProfilePageTabsError
          Icon={TbMailboxOff}
          content="can't get this user orders at the moment"
        />
      );
    }
  }

  return (
    <OrdersArea
      isError={userOrdersErr}
      loading={userOrdersLoading}
      orders={userOrders?.orders || []}
      noOrdersMsg="you don't have any orders yet"
    />
  );
};
export default ProfilePageOrdersArea;
