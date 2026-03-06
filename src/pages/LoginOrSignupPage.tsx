// react
import { useEffect, useRef } from "react";

// react-router-dom
import { Link, useLocation } from "react-router-dom";

// components
import BtnWithSpinner from "../components/animatedBtns/BtnWithSpinner";
import FormList from "../components/appForm/FormList";
import FormInput from "../components/appForm/Input/FormInput";

// react-hook-form
import { useForm } from "react-hook-form";

// hooks
import useSubmitLoginAndSignupForm from "../hooks/useSubmitLoginAndSignupForm";

// types
import type { UserType } from "../utils/types";

// layouts
import AnimatedLayout from "../layouts/AnimatedLayout";

export type LoginAndSugnupFormValues = Omit<UserType, "_id"> & {
  password: string;
};

// component \\
const LoginOrSignupPage = ({ type }: { type: "login" | "signup" }) => {
  // react-router-dom
  const { pathname } = useLocation();

  // refs
  const renders = useRef(0);

  // react-hook-form
  const form = useForm<LoginAndSugnupFormValues>({
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

  const { disableSubmit, loading, onSubmit } = useSubmitLoginAndSignupForm({
    type,
  });

  // useEffects

  // don't change the dependency array!
  // when switching from login to signup or opposite => reset the form
  useEffect(() => {
    if (renders.current === 0) renders.current += 1;
    if (renders.current !== 0) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
          toggleSpinner={loading}
          title="submit"
          className="btn"
          type="submit"
          disabled={!isDirty || loading || disableSubmit}
        >
          {disableSubmit ? "redirecting..." : type}
        </BtnWithSpinner>
      </form>

      <p data-testid="auth-msg" className="auth-msg">
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
    </AnimatedLayout>
  );
};

export default LoginOrSignupPage;
