import { useState, forwardRef, type ChangeEvent } from "react";

// icons
import { HiEye, HiEyeOff } from "react-icons/hi";

// components
import InputComponent from "./InputComponent";
import IconsSwitcher from "../../IconsSwitcher";
import ErrorDiv from "./ErrorDiv";

// types
import type { InputPropsType } from "./InputComponent";

// framer motion
import { motion } from "framer-motion";

const FormInput = forwardRef<
  HTMLInputElement,
  InputPropsType & { errorMsg?: string }
>((props, ref) => {
  const { type, errorMsg, ...attr } = props;
  // states
  const [inputValue, setInputValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      layout="size"
      transition={{
        type: "tween",
        duration: 0.15,
        ease: "easeInOut",
      }}
      className="input-holder"
    >
      {type === "password" && (
        <div className="password-input-holder">
          <InputComponent
            {...attr}
            error={!!errorMsg}
            ref={ref}
            type={showPassword ? "text" : "password"}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              props.onChange?.(e);
              setInputValue(e.target.value);
            }}
          />

          <button
            title="show password btn"
            className="btn icons-switcher-holder-parent"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={!inputValue}
          >
            <IconsSwitcher
              firstIcon={<HiEye />}
              lastIcon={<HiEyeOff />}
              iconsColor="white"
              isActive={showPassword}
            />
          </button>
        </div>
      )}

      {type === "color" && (
        <div className="color-input-wrapper">
          <InputComponent ref={ref} {...attr} error={!!errorMsg} type={type} />
        </div>
      )}

      {/* all kinds of inputs instedof password and color inputs */}
      {type !== "password" && type !== "color" ? (
        <InputComponent ref={ref} {...attr} type={type} error={!!errorMsg} />
      ) : null}

      <ErrorDiv msg={errorMsg} />
    </motion.div>
  );
});

export default FormInput;
