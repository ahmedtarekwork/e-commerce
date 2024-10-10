// react
import { useEffect } from "react";

// react-router-dom
import { RouterProvider } from "react-router-dom";

// redux
import useSelector from "./hooks/redux/useSelector";
import useDispatch from "./hooks/redux/useDispatch";
// redux actions
import { setUser } from "./store/fetures/userSlice";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import SplashScreen from "./components/spinners/SplashScreen";

// utils
import axios from "./utils/axios";

// types
import type { UserType } from "./utils/types";

// hooks
import useAppRouter from "./hooks/useAppRouter";

// fetchers
const checkUserQueryFn = async (): Promise<UserType> => {
  return (await axios.get("auth/checkUser")).data;
};

const App = () => {
  onbeforeunload = () => scrollTo(0, 0);

  // redux
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // react query
  // checkUser
  const {
    refetch: checkUserQuery,
    data: checkUserData,
    isPending: checkUserLoading,
  } = useQuery({
    queryKey: ["checkUser"],
    queryFn: checkUserQueryFn,
    enabled: false,
    refetchOnMount: false,
  });

  // app router hook
  const appRouter = useAppRouter(checkUserLoading);

  // if there is a token in cookies => try to login user automatically
  useEffect(() => {
    if (!user) checkUserQuery();
  }, []);

  useEffect(() => {
    if (checkUserData && !("message" in checkUserData))
      dispatch(setUser(checkUserData));
  }, [checkUserData, dispatch]);

  if (checkUserLoading) return <SplashScreen>Loading...</SplashScreen>;

  return <RouterProvider router={appRouter} />;
};

export default App;
