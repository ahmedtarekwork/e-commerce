import { ComponentProps, forwardRef } from "react";
import { BsCheckLg } from "react-icons/bs";

interface listType {
  ListType: "radio-list" | "check-list";
}

interface theInputProps extends ComponentProps<"input"> {
  label: string;
  id: string;
}

const TheInput = forwardRef<HTMLInputElement, theInputProps>(
  ({ label, ...inputAttr }, ref) => {
    const { id } = inputAttr;

    return (
      <>
        <input {...inputAttr} ref={ref} />
        <label htmlFor={id}>
          <button>
            <BsCheckLg />
          </button>
          {label}
        </label>
      </>
    );
  }
);

interface Listprops extends listType, ComponentProps<"ul"> {
  sectionTitle?: string;
  inputsList: theInputProps[];
}

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
        className={`${className ? `${className} ` : ""}form-list`}
      >
        {inputsList.map((input, i) => (
          <li key={i}>
            <TheInput
              {...input}
              type={ListType === "radio-list" ? "radio" : "checkbox"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormList;
