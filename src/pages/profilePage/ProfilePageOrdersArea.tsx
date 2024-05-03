// react
import { useEffect } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import OrdersArea from "../../components/orders/OrdersArea";

// utiles
import { axiosWithToken } from "../../utiles/axios";

// types
import { OrderType, UserType } from "../../utiles/types";

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
  return (await axiosWithToken("orders/user-orders/" + userId)).data;
};

const ProfilePageOrdersArea = ({ user, isCurrentUserProfile }: Props) => {
  // get user orders
  const {
    refetch: getUserOrders,
    data: userOrders,
    error: userOrdersErrData,
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

  return (
    <>
      <h3>orders</h3>
      <OrdersArea
        error={userOrdersErrData}
        isError={userOrdersErr}
        loading={userOrdersLoading}
        orders={userOrders?.orders || []}
        noOrdersMsg={
          isCurrentUserProfile
            ? "you don't have any orders yet"
            : "this user hasn't any orders yet"
        }
      />
    </>
  );
};
export default ProfilePageOrdersArea;
