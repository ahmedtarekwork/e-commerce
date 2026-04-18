import { users as initUsers } from "../auth/statics";
import { orders } from "../orders/statics";

import type { OrderType, UserType } from "../../../../utils/types";

type UserTypeWithOrders = UserType & { orders: OrderType[] };

export const allUsersEndpointData = JSON.parse(JSON.stringify(initUsers)).map(
  (user: UserTypeWithOrders, i: number) => ({
    ...user,
    address: i === 0 ? "egypt" : undefined,
    orders: i === 0 ? [] : orders,
    isAdmin: !!i,
  }),
) as UserTypeWithOrders[];
