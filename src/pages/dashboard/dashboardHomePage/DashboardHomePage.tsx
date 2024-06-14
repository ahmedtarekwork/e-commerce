// react
import { useEffect } from "react";

// react router dom
import { Link } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// redux
import useDispatch from "../../../hooks/redux/useDispatch";
import useSelector from "../../../hooks/redux/useSelector";
// redux actions
import { setAllUsers } from "../../../store/fetures/userSlice";

// components
import Heading from "../../../components/Heading";
import DashboardSquare, { DashboardSqaureProps } from "./DashboardSquare";

// utils
import { nanoid } from "@reduxjs/toolkit";
import { axiosWithToken } from "../../../utiles/axios";

// icons
import { FaUser, FaListAlt } from "react-icons/fa";
import { BiSolidComponent } from "react-icons/bi";
import storeWithArrow from "../../../../imgs/strore_with_arrow.svg";
import { TbHomeCog } from "react-icons/tb";

// fetchers
const getProductsCountQueryFn = async () => {
  return (await axiosWithToken("products")).data.products.length;
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
    (state) => state.products.products.length
  );
  const appOrdersCount = useSelector((state) => state.orders.orders.length);

  const { allUsers } = useSelector((state) => state.user);
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
      Icon: BiSolidComponent,
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

      <ul className="dashboard-page-top-btns">
        <li>
          <Link
            title="go back to store home page btn"
            to="/"
            relative="path"
            className="btn back-to-store-btn"
          >
            <img
              src={storeWithArrow}
              width="24px"
              height="24px"
              alt="store with back arrow icon"
            />
            Back To Store
          </Link>
        </li>

        <li>
          <Link
            title="go to home page settings page btn"
            to="/dashboard/homePageSettings"
            relative="path"
            className="btn"
          >
            <TbHomeCog
              style={{
                fontSize: 24,
              }}
            />
            Home Page Settings
          </Link>
        </li>
      </ul>

      <ul className="dashboard-squares-list">
        {squares.map((square) => (
          <DashboardSquare {...square} key={nanoid()} />
        ))}
      </ul>
    </>
  );
};

export default DashboardHomePage;
