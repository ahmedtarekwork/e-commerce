// react
import { useRef, useEffect, useState } from "react";

// react-router-dom
import { Link, useLocation, useNavigate } from "react-router-dom";

// redux
import useDispatch from "../hooks/redux/useDispatch";
// redux actions
import { setUser } from "../store/fetures/userSlice";

// components
import FormInput from "../components/appForm/Input/FormInput";
import FormList from "../components/appForm/FormList";
import TopMessage, { type TopMessageRefType } from "../components/TopMessage";
import BtnWithSpinner from "../components/animatedBtns/BtnWithSpinner";

// react-hook-form
import { SubmitHandler, useForm } from "react-hook-form";

// react query
import { useMutation } from "@tanstack/react-query";

// utiles
import axios from "../utiles/axios";
import cookie from "js-cookie";
import handleError from "../utiles/functions/handleError";

// types
import type { UserType } from "../utiles/types";

// layouts
import AnimatedLayout from "../layouts/AnimatedLayout";

type FormValues = Omit<UserType, "_id"> & { password: string };

// fetchers
const loginMutationFn = async (userData: {
  username: string;
  password: string;
}): Promise<UserType & { accessToken?: string }> => {
  return (await axios.post("auth/login", userData, { timeout: 30 * 1000 }))
    .data;
};
const registerMutationFn = async (
  userData: Omit<UserType, "_id"> & { password: string }
) => {
  return (await axios.post("auth/register", userData)).data;
};

// component \\
const LoginPage = ({ type }: { type: "login" | "signup" }) => {
  const dispatch = useDispatch();

  // react-router-dom
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // refs
  const msgRef = useRef<TopMessageRefType>(null);
  const renders = useRef(0);

  // states
  const [disableSubmit, setDisableSubmit] = useState(false);

  // react-hook-form
  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      address: "",
      isAdmin: false,
    },
  });
  const { handleSubmit, register, formState, reset } = form;
  const {
    isDirty,
    errors: { email: emailErr, password: passwordErr, username: usernameErr },
  } = formState;

  // react query
  // login
  const {
    data: loginData,
    error: loginErrData,
    isError: loginErr,
    isPending: loginLoading,
    status: loginStatus,
    mutate: loginMutate,
  } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginMutationFn,
  });
  // register
  const {
    data: registerData,
    isPending: registerLoading,
    error: registerErrData,
    isError: registerErr,
    status: registerStatus,
    mutate: registerMutate,
    reset: resetRegister,
  } = useMutation({
    mutationKey: ["register"],
    mutationFn: registerMutationFn,
  });

  // handlers
  const onSubmit: SubmitHandler<FormValues> = (data, e) => {
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

  // useEffects

  // don't change the dependency array!
  // when switching from login to signup or opposite => reset the form
  useEffect(() => {
    if (renders.current === 0) renders.current += 1;
    if (renders.current !== 0) {
      reset();
    }
  }, [pathname]);

  // login user
  useEffect(() => {
    if (loginStatus !== "idle") {
      if (loginData) {
        if (loginData.accessToken) {
          cookie.set("dashboard-jwt-token", loginData.accessToken, {
            expires: 7,
          });
        }

        const user = { ...loginData };
        delete user.accessToken;

        dispatch(setUser(user));
      }

      if (loginErr)
        handleError(loginErrData, msgRef, {
          forAllStates: "something went wrong while register a new user",
        });
    }
  }, [loginData, loginErr, loginErrData, loginStatus, dispatch]);

  // register new user
  useEffect(() => {
    if (registerStatus !== "idle") {
      if (registerErr) {
        handleError(registerErrData, msgRef, {
          forAllStates: "something went wrong while register a new user",
        });
      }

      if (registerData) {
        setDisableSubmit(true);
        msgRef.current?.setMessageData?.({
          clr: "green",
          content: "user registerd successfully",
          time: 1500,
          show: true,
        });
        setTimeout(() => {
          navigate("/login", { relative: "path" });
          resetRegister();
          setDisableSubmit(false);
        }, 1500);
      }
    }
  }, [registerErr, registerData, registerErrData, registerStatus]);

  return (
    <AnimatedLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="auth-form"
        autoComplete="off"
        noValidate
      >
        <h1 className="form-title">{type}</h1>

        {type === "signup" && (
          <FormInput
            errorMsg={emailErr?.message}
            {...register("email", {
              required: "email is required",
              validate: {
                notEmail: (val) =>
                  /\S+@{1}\S+\.\S+/gi.test(val) || "please enter a valid email",
              },
            })}
            type="email"
            id="email"
            placeholder="email"
          />
        )}

        <FormInput
          errorMsg={usernameErr?.message}
          {...register("username", {
            required: "username is required",
          })}
          type="text"
          id="username"
          placeholder="username"
        />

        <FormInput
          errorMsg={passwordErr?.message}
          {...register("password", {
            required: "password is required",
            minLength: {
              value: 6,
              message: "password must be 6 characters or more",
            },
          })}
          type="password"
          id="password"
          placeholder="password"
        />

        {type === "signup" && (
          <>
            <FormInput
              {...register("address")}
              type="text"
              id="address"
              placeholder="address"
            />
            <FormList
              ListType="check-list"
              inputsList={[
                {
                  ...register("isAdmin"),
                  label: "isAdmin",
                  id: "isAdmin",
                },
              ]}
            />
          </>
        )}

        <BtnWithSpinner
          toggleSpinner={loginLoading || registerLoading}
          title="submit"
          className="btn"
          type="submit"
          disabled={
            !isDirty || loginLoading || registerLoading || disableSubmit
          }
        >
          {disableSubmit ? "redirecting..." : type}
        </BtnWithSpinner>
      </form>

      <p className="auth-msg">
        {type === "login"
          ? "you don't have an account?"
          : "you have an account already?"}

        <Link
          title={`go to ${type === "login" ? "signup" : "login"} page`}
          to={`/${type === "login" ? "signup" : "login"}`}
          relative="path"
          className="link"
        >
          {type === "login" ? "signup" : "login"}
        </Link>
      </p>

      <TopMessage ref={msgRef} />
    </AnimatedLayout>
  );
};

export default LoginPage;
