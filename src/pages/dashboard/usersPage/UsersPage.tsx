// react
import { useEffect, useRef, useState } from "react";

// redux
import useDispatch from "../../../hooks/redux/useDispatch";
// redux actions
import { setAllUsers } from "../../../store/fetures/userSlice";

// react-query
import { useQuery } from "@tanstack/react-query";

// components
import UsersPageCell from "./UsersPageCell";
import Heading from "../../../components/Heading";
import SplashScreen from "../../../components/spinners/SplashScreen";
import DisplayError from "../../../components/layout/DisplayError";
// modal
import AppModalCell from "../../../components/modals/appModal/AppModalCell";
import GridList from "../../../components/gridList/GridList";
import OrderCard from "../../../components/orders/OrderCard";

import AppModal, {
  type AppModalRefType,
} from "../../../components/modals/appModal/AppModal";
import TopMessage, {
  type TopMessageRefType,
} from "../../../components/TopMessage";

// utiles
import axios from "../../../utiles/axios";

// types
import type { OrderType, UserType } from "../../../utiles/types";
import type { AxiosResponse } from "axios";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

const cells = ["username", "email", "address", "isAdmin", "orders", "delete"];
const errMsg = "something went wrong while getting users list";

// fetchers
const getAllUsers = async (): Promise<
  (UserType & { orders: OrderType[] })[]
> => {
  let users = (await axios("users")).data;

  if (!users) throw new Error("users not found");

  const usersOrders: { orders: OrderType[]; orderby: string }[] = (
    (await axios.all(
      users.map(({ _id }: UserType) => axios("/orders/user-orders/" + _id))
    )) as AxiosResponse[]
  ).map((order) => order.data);

  users = users.map((user: UserType) => ({
    ...user,
    orders: usersOrders.find((orders) => orders.orderby === user._id)?.orders,
  }));

  return users;
};

const UsersPage = () => {
  const dispatch = useDispatch();

  // refs
  const modalRef = useRef<AppModalRefType>(null);
  const msgRef = useRef<TopMessageRefType>(null);

  // states
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");

  // react query
  const {
    data: usersList,
    isError: usersListErr,
    error: usersListErrData,
    isPending: usersListLoading,
  } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: getAllUsers,
  });

  useEffect(() => {
    if (usersList) dispatch(setAllUsers(usersList));
  }, [usersList, dispatch]);

  if (usersListLoading)
    return <SplashScreen notMain>Loading Users...</SplashScreen>;

  if (usersListErr)
    return <DisplayError error={usersListErrData} initMsg={errMsg} />;

  if (!usersList) return <h1>{errMsg}</h1>;

  return (
    <AnimatedLayout>
      <Heading>Users List</Heading>

      <GridList isChanging={false} initType="row" cells={cells}>
        {usersList.map((user) => {
          return (
            <UsersPageCell
              msgRef={msgRef}
              key={user._id}
              cells={cells}
              modalRef={modalRef}
              user={user}
              setSelectedUsername={setSelectedUsername}
              setSelectedUserId={setSelectedUserId}
              selectedUserId={selectedUserId}
            />
          );
        })}
      </GridList>

      <AppModal ref={modalRef} toggleClosingFunctions={true}>
        <Heading>Orders List For {selectedUsername}</Heading>

        {usersList
          .find((user) => user._id === selectedUserId)
          ?.orders.map((order) => {
            return (
              <AppModalCell key={order._id}>
                <OrderCard order={order} />
              </AppModalCell>
            );
          })}
      </AppModal>

      <TopMessage ref={msgRef} />
    </AnimatedLayout>
  );
};

export default UsersPage;
