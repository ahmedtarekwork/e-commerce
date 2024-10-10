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

// utils
import axios from "../../../utils/axios";

// types
import type { OrderType, UserType } from "../../../utils/types";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";

const cells = ["username", "email", "address", "isAdmin", "orders", "delete"];
const errMsg = "something went wrong while getting users list";

// fetchers
const getAllUsers = async (): Promise<
  (UserType & { orders: OrderType[] })[]
> => {
  return (await axios("users")).data;
};

const UsersPage = () => {
  const dispatch = useDispatch();

  // refs
  const modalRef = useRef<AppModalRefType>(null);

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
              key={user._id}
              cells={cells}
              modalRef={modalRef}
              user={user}
              setSelectedUsername={setSelectedUsername}
              setSelectedUserId={setSelectedUserId}
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
    </AnimatedLayout>
  );
};

export default UsersPage;
