// react
import { useEffect } from "react";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../../../hooks/useDispatch";
import { useSelector } from "react-redux";
// redux actions
import { setAllUsers } from "../../../store/fetures/userSlice";

// components
import Heading from "../../../components/Heading";
import DashboardSquare, { DashboardSqaureProps } from "./DashboardSquare";
import GridList from "../../../components/gridList/GridList";
import GridListItem from "../../../components/gridList/GridListItem";

// utiles
import { nanoid } from "@reduxjs/toolkit";
import { axiosWithToken } from "../../../utiles/axios";

// icons
import { FaUser, FaListAlt } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

// types
import { RootStateType } from "../../../utiles/types";
import { Link } from "react-router-dom";

// fetchers
const getProductsCountQueryFn = async () => {
  return (await axiosWithToken("products")).data.length;
};

const getOrdersCountQueryFn = async () => {
  return (await axiosWithToken("orders")).data.orders.length;
};

const getUsersQueryFn = async () => {
  return (await axiosWithToken("users")).data;
};

const DashboardHomePage = () => {
  const dispatch = useDispatch();
  const appProductsCount = useSelector(
    (state: RootStateType) => state.products.products.length
  );
  const appOrdersCount = useSelector(
    (state: RootStateType) => state.orders.orders.length
  );

  const { allUsers } = useSelector((state: RootStateType) => state.user);
  const admins = allUsers.filter((user) => user.isAdmin);
  const appUsersCount = allUsers.length;

  // get products count
  const {
    refetch: getProductsCount,
    isPending: productsCountLoading,
    data: productsCount,
    isError: productsCountErr,
    fetchStatus: productsCountStatus,
  } = useQuery({
    queryKey: ["getProductsCount"],
    queryFn: getProductsCountQueryFn,
    enabled: false,
  });

  // get orders count
  const {
    refetch: getOrdersCount,
    isPending: ordersCountLoading,
    data: ordersCount,
    isError: ordersCountErr,
    fetchStatus: ordersCountStatus,
  } = useQuery({
    queryKey: ["getOrdersCount"],
    queryFn: getOrdersCountQueryFn,
    enabled: false,
  });

  // get users
  const {
    refetch: getUsers,
    isPending: usersLoading,
    data: resUsers,
    isError: usersErr,
    fetchStatus: usersStatus,
  } = useQuery({
    queryKey: ["getUsersCount"],
    queryFn: getUsersQueryFn,
    enabled: false,
  });

  // send requests to get numbers in initial render "don't change dependencies array!"
  useEffect(() => {
    if (!appProductsCount) getProductsCount();
    if (!appOrdersCount) getOrdersCount();
    if (!appUsersCount) getUsers();
  }, []);

  useEffect(() => {
    if (resUsers) dispatch(setAllUsers(resUsers));
  }, [resUsers, dispatch]);

  const squares: DashboardSqaureProps[] = [
    {
      title: "Products",
      Icon: MdOutlineProductionQuantityLimits,
      path: "/dashboard/products",
      number: appProductsCount || productsCount,
      loading: productsCountLoading && productsCountStatus !== "idle",
      noNum: !appProductsCount && productsCountErr,
    },
    {
      title: "Orders",
      path: "/dashboard/orders",
      Icon: FaListAlt,
      number: appOrdersCount || ordersCount,
      loading: ordersCountLoading && ordersCountStatus !== "idle",
      noNum: !appOrdersCount && ordersCountErr,
    },
    {
      title: "Users",
      Icon: FaUser,
      path: "/dashboard/users",
      number: appUsersCount || resUsers?.length,
      loading: usersLoading && usersStatus !== "idle",
      noNum: !appUsersCount && usersErr,
    },
  ];

  return (
    <>
      <div className="section">
        <Heading content="Dashboard" />
      </div>

      <ul className="dashboard-squares-list">
        {squares.map((square) => (
          <DashboardSquare {...square} key={nanoid()} />
        ))}
      </ul>

      <h2>Admins List</h2>

      <GridList
        initType="row"
        isChanging={false}
        cells={["username", "email", "address", "more info"]}
      >
        {admins.slice(0, 5).map(({ _id, username, email, address }) => {
          return (
            <GridListItem
              key={_id}
              cells={["username", "email", "address", "moreInfo"]}
              itemData={{
                username,
                email,
                address: address || "--",
                moreInfo: (
                  <Link
                    className="btn"
                    to={"/dashboard/singleUser/" + _id}
                    relative="path"
                  >
                    more info
                  </Link>
                ),
              }}
            />
          );
        })}
      </GridList>

      <Link to="/dashboard/users" className="btn see-more-btn">
        see more
      </Link>
    </>
  );
};

export default DashboardHomePage;
