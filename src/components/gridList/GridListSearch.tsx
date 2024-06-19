// react
import {
  type ChangeEvent,
  // , useRef
} from "react";

// components
import FormInput from "../appForm/Input/FormInput";
import SelectList, {
  type SelectListComponentProps,
} from "../selectList/SelectList";

// utils
// import { nanoid } from "@reduxjs/toolkit";

export type GridListSearchProps = {
  initValue?: string;
  categories?: {
    list: string[];
    optionOnClickFn: SelectListComponentProps["optClickFunc"];
  };
  placeholder: string;
  onInputChangeFn: (e: ChangeEvent<HTMLInputElement>) => void;
};

const GridListSearch = ({
  categories,
  initValue,
  placeholder,
  onInputChangeFn,
}: GridListSearchProps) => {
  // const listId = useRef(nanoid());

  return (
    <div
      className={`grid-list-search-holder${
        categories?.list.length ? " remove-borders" : ""
      }`}
    >
      <FormInput
        defaultValue={initValue || ""}
        type="text"
        placeholder={placeholder}
        onChange={onInputChangeFn}
      />

      {categories && (
        <SelectList
          outOfFlow={{
            value: true,
            fullWidth: false,
          }}
          // id={`grid-list-search-list-${listId.current}`}
          optClickFunc={categories.optionOnClickFn}
          listOptsArr={categories.list.map((c, i) => ({
            selected: i === 0,
            text: c,
          }))}
        />
      )}
    </div>
  );
};
export default GridListSearch;
