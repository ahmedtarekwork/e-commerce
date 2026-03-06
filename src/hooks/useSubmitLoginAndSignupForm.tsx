// react
import { useState } from "react";

// react query
import { useMutation } from "@tanstack/react-query";

// react router dom
import { useNavigate } from "react-router-dom";

// redux
import useDispatch from "./redux/useDispatch";
// redux actions
import { setUser } from "../store/fetures/userSlice";

// utils
import axios from "../utils/axios";
// hooks
import useHandleErrorMsg from "./useHandleErrorMsg";
import useShowMsg from "./useShowMsg";

// types
import type { SubmitHandler } from "react-hook-form";
import type { LoginAndSugnupFormValues } from "../pages/LoginOrSignupPage";
import type { UserType } from "../utils/types";

type Props = {
  type: "login" | "signup";
};

// fetchers
const loginMutationFn = async (userData: {
  username: string;
  password: string;
}): Promise<UserType & { accessToken?: string }> => {
  return (
    await axios.post("auth/login/credentials", userData, {
      timeout: 30 * 1000,
    })
  ).data;
};
const registerMutationFn = async (
  userData: Omit<UserType, "_id"> & { password: string },
) => {
  return (await axios.post("auth/register", userData)).data;
};

const useSubmitLoginAndSignupForm = ({ type }: Props) => {
  const dispatch = useDispatch();
  const showMsg = useShowMsg();
  const handleError = useHandleErrorMsg();
  const navigate = useNavigate();

  const [disableSubmit, setDisableSubmit] = useState(false);

  // react query
  // login
  const { isPending: loginLoading, mutate: loginMutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginMutationFn,
    onSuccess(data) {
      dispatch(setUser({ ...data }));
    },
    onError(error) {
      handleError(error, {
        forAllStates: "something went wrong while login",
      });
    },
  });
  // register
  const {
    isPending: registerLoading,
    mutate: registerMutate,
    reset: resetRegister,
  } = useMutation({
    mutationKey: ["register"],
    mutationFn: registerMutationFn,
    onSuccess() {
      setDisableSubmit(true);
      showMsg?.({
        clr: "green",
        content: "user registerd successfully",
        time: 1500,
      });
      setTimeout(() => {
        navigate("/login", { relative: "path" });
        resetRegister();
        setDisableSubmit(false);
      }, 1500);
    },
    onError(error) {
      handleError(error, {
        forAllStates: "something went wrong while register a new user",
      });
    },
  });

  const onSubmit: SubmitHandler<LoginAndSugnupFormValues> = (data, e) => {
    e?.preventDefault();

    if (type === "login") {
      const userData = { username: data.username, password: data.password };

      loginMutate(userData);
    } else {
      const userData = data;
      if (!userData.address) delete userData.address;

      registerMutate(userData);
    }
  };

  return {
    onSubmit,
    loading: registerLoading || loginLoading,
    disableSubmit,
  };
};
export default useSubmitLoginAndSignupForm;
