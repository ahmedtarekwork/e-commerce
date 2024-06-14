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
  sectionTitle?: string;
  inputsList: FromListInputProps[];
  ListType: FormListType;
} & ComponentProps<"ul">;

const FormList = ({
  sectionTitle: title,
  ListType,
  inputsList,

  ...listAttr
}: Listprops) => {
  const { className } = listAttr;

  return (
    <div className="form-list-holder">
      {title && <h3 className="form-secondary-title">{title}</h3>}
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
    </div>
  );
};

export default FormList;
