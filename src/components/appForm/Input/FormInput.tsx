import { useState, forwardRef, ChangeEvent } from "react";

// icons
import { AiFillEye } from "react-icons/ai";

// components
import InputComponent from "./InputComponent";
import ErrorDiv from "./ErrorDiv";

// types
import { InputPropsType } from "../../../utiles/types";

const FormInput = forwardRef<HTMLInputElement, InputPropsType>((props, ref) => {
  const { type, errorMsg } = props;

  // states
  const [inputValue, setInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={`input-holder`}
      {...(type === "password" ? { "data-type": "button" } : {})}
    >
      {type === "password" && (
        <>
          <InputComponent
            {...props}
            ref={ref}
            type={showPassword ? "text" : "password"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              props.onChange?.(e);
              setInputValue(e.target.value);
            }}
          />

          <button
            className="btn"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={!inputValue}
          >
            {showPassword ? "hide" : "show"} password
            <span>
              <AiFillEye />
            </span>
          </button>
        </>
      )}

      {type === "color" && (
        <div className="color-input-wrapper">
          <InputComponent ref={ref} {...props} />
        </div>
      )}

      {/* all kinds of inputs instedof password and color inputs */}
      {type !== "password" && type !== "color" ? (
        <InputComponent ref={ref} {...props} />
      ) : null}

      {"errorMsg" in props && <ErrorDiv msg={errorMsg} />}
    </div>
  );
});

export default FormInput;
