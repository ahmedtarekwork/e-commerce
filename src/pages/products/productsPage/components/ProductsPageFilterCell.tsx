// react
import {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,

  // types
  type RefObject,
  type ReactNode,
} from "react";

// components
import ListWrapper from "../../../../components/ListWrapper";
import FormList, {
  type FormListType,
  type FromListInputProps,
} from "../../../../components/appForm/FormList";

// utils
import { nanoid } from "@reduxjs/toolkit";

type Props = {
  title: string;
  loading?: boolean;
} & (
  | {
      type: FormListType;
      optionsList: string[] | undefined;
      children?: never;
    }
  | {
      children: ReactNode;
      type: "custom";
      optionsList?: never;
    }
);

export type ProductsPageFilterCellRefType = {
  optionsRefsList: RefObject<HTMLInputElement>[] | undefined;
};

const ProductsPageFilterCell = forwardRef<ProductsPageFilterCellRefType, Props>(
  ({ children, title, type, optionsList, loading }, ref) => {
    const optionsRefsList = optionsList?.map(() =>
      createRef<HTMLInputElement>()
    );

    useEffect(() => {
      console.log(optionsRefsList);
    }, []);

    useImperativeHandle(ref, () => ({ optionsRefsList }), []);

    return (
      <li
        className="products-page-filters-list-cell"
        data-disabled={loading || (type !== "custom" && optionsList?.length)}
      >
        <ListWrapper
          className="products-page-filters-list-cell-list"
          btnData={{
            children: title,
          }}
          style={{
            padding: 10,
          }}
        >
          {type === "custom"
            ? children
            : optionsList?.length && (
                <FormList
                  ListType={type}
                  inputsList={optionsList.map(
                    (option, i) =>
                      ({
                        id: nanoid(),
                        label: option,
                        ref: optionsRefsList?.[i],
                      } as FromListInputProps)
                  )}
                />
              )}
        </ListWrapper>
      </li>
    );
  }
);
export default ProductsPageFilterCell;
