// react
import {
  createRef,
  forwardRef,
  useImperativeHandle,
  memo,

  // types
  type RefObject,
  type ReactNode,
} from "react";

// components
import ListWrapper from "../../../../../components/ListWrapper";
import EmptySpinner from "../../../../../components/spinners/EmptySpinner";
import FormList, {
  type FormListType,
  type FromListInputProps,
} from "../../../../../components/appForm/FormList";

// utils
import { nanoid } from "@reduxjs/toolkit";

export type SharedProductsPageFilterCellProps = {
  title: string;
  loading?: boolean;
};

export type ListCellType = {
  type: FormListType;
  optionsList: string[] | undefined;
  defaultValues?: string[];
  children?: never;
};

type CustomCellType = {
  children: ReactNode;
  type: "custom";
  optionsList?: never;
  defaultValues?: never;
};

type Props = SharedProductsPageFilterCellProps &
  (ListCellType | CustomCellType);

export type ProductsPageFilterCellRefType = {
  optionsRefsList: RefObject<HTMLInputElement>[] | undefined;
};

const ProductsPageFilterCell = memo(
  forwardRef<ProductsPageFilterCellRefType, Props>(
    ({ children, title, type, optionsList, loading, defaultValues }, ref) => {
      const optionsRefsList = optionsList?.map(() =>
        createRef<HTMLInputElement>()
      );

      useImperativeHandle(ref, () => ({ optionsRefsList }), [optionsRefsList]);

      return (
        <li
          className="products-page-filters-list-cell"
          data-disabled={loading || (type !== "custom" && optionsList?.length)}
        >
          <ListWrapper
            closeOptions={{
              insideClose: false,
              outsideClose: false,
            }}
            disabled={{
              value: loading || false,
              text: (
                <div>
                  {title} (
                  <EmptySpinner
                    settings={{
                      diminsions: "12px",
                      clr: "gray",
                      "brdr-width": "2px",
                    }}
                    style={{ display: "inline-block", margin: "0 8px" }}
                  />
                  )
                </div>
              ),
            }}
            btnData={{
              children: (
                <p style={{ color: "var(--main)" }}>
                  {title}{" "}
                  {optionsList?.length && !loading
                    ? `(${optionsList?.length})`
                    : null}
                </p>
              ),
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
                          defaultChecked: defaultValues?.some(
                            (d) => d === option
                          ),
                          name:
                            type === "check-list"
                              ? option
                              : `${title}-filters-list-input`,
                          id: nanoid(),
                          label: option,
                          ref: optionsRefsList?.[i],
                          "data-name": option,
                        } as FromListInputProps)
                    )}
                  />
                )}
          </ListWrapper>
        </li>
      );
    }
  )
);
export default ProductsPageFilterCell;
