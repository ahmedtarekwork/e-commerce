// react
import { type ComponentProps } from "react";

// icons
import { BsCheckLg } from "react-icons/bs";

// utils
import { nanoid } from "@reduxjs/toolkit";

export type FormListType = "radio-list" | "check-list";

export type FromListInputProps = {
  label: string;
  id: string;
} & ComponentProps<"input">;

type Listprops = {
  inputsList: FromListInputProps[];
  ListType: FormListType;
} & ComponentProps<"ul">;

const FormList = ({
  ListType,
  inputsList,

  ...listAttr
}: Listprops) => {
  const { className } = listAttr;

  return (
    <>
      <ul
        {...listAttr}
        className={`form-list${className ? ` ${className}` : ""}`}
      >
        {inputsList.map(({ label, ...input }) => (
          <li key={nanoid()}>
            <input
              {...input}
              type={ListType === "radio-list" ? "radio" : "checkbox"}
            />
            <label htmlFor={input.id}>
              <span>
                <BsCheckLg />
              </span>

              {label}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};

export default FormList;
